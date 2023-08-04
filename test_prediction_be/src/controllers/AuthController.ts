import { Request, Response } from "express";
import { myDataSource } from "../config/config";
import { validate } from "class-validator";
import { Operatore } from "../entity/Operatore";
import { generateOTP } from "../services/otpGenerator";
import SenderController from "../services/mailGenerator";
import config from "../config/config";
import axios from "axios";
import * as jwt from "jsonwebtoken";

class AuthController {
  static login = async (req: Request, res: Response) => {
    //Check if username and password are set
    let { username, password } = req.body;

    if (!(username && password)) {
      res.status(400).send("password or username empty");
      return
    }

    //Get operatore from database
    const userRepository = myDataSource.getRepository(Operatore);
    let operatore: Operatore;
    try {
      operatore = await userRepository.findOneOrFail({ where: { username } });
    } catch (error) {
      res.status(401).send("username not found");
      return;
    }

    //Check if encrypted password match
    if (!operatore.checkIfUnencryptedPasswordIsValid(password)) {
      res.status(401).send("invalid password");
      return;
    }

    delete operatore['password']; //la elimino per evitare di inviarla al frontend anche se criptata

    //Send the jwt in the response
    let response = {
      operatore: operatore//.role
    }
    await AuthController.generateMailOtp({ mail: operatore.mail })
      .then(() => {
        res.send(response);
      }).catch((e) => {
        res.status(500).send("Non è stato possibile inviare la mail con l'otp per favore riprovare");
      })
  };

  static generateMailOtp = async (param: any) => {
    const otpGenerated = generateOTP();
    return await new Promise(async (resolve, reject) => {
      await myDataSource.getRepository(Operatore).findOneOrFail({ where: { mail: param.mail } })
        .then(async (res) => {

          res.otp = otpGenerated
          await myDataSource.getRepository(Operatore).save(res)
            .then(async (newOp: any) => {
              await SenderController.sendEmail({
                to: param.mail,
                OTP: otpGenerated,
              });
              resolve(newOp);
            }).catch((e) => {
              reject(e)
            })
        }).catch((e) => {
          reject(e)
        })

    })
  }

  static checkRecaptcha = async (req: Request, res: Response) => {

    const { token } = req.body; // Il token ottenuto dal frontend

    try {
      const googleResponse = await axios.post(
        `https://www.google.com/recaptcha/api/siteverify?secret=6LfFIt4mAAAAAGD47RsZ4xzx8myx57900K5cn0AY&response=${token}`
      );

      const { success } = googleResponse.data; // Se la verifica ha avuto successo, sarà true

      if (success) {
        res.status(200).json({ success: true });
      } else {
        res.status(403).json({ success: false, message: "Failed to verify reCAPTCHA" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Server error" });
    }
    
  }

  static rigenerateMailOtp = async (req: Request, res: Response) => {
    const otpGenerated = generateOTP();
    let { mail } = req.body;
    await myDataSource.getRepository(Operatore).findOneOrFail({ where: { mail: mail } })
      .then(async (op) => {

        op.otp = otpGenerated
        await myDataSource.getRepository(Operatore).save(op)
          .then(async (newOp: any) => {
            await SenderController.sendEmail({
              to: mail,
              OTP: otpGenerated,
            });
            res.status(200).send(newOp);
          }).catch((e) => {
            res.status(500).send(e)
          })
      }).catch((e) => {
        res.status(500).send(e)
      })

  }

  static validateOtp = async (req: Request, res: Response) => {
    let { operatore, otp } = req.body;
    await myDataSource.getRepository(Operatore).findOneOrFail({ where: { mail: operatore.mail } })
      .then((op: any) => {
        if (op.otp !== otp) {
          res.status(500).send('Codice OTP errato')
        } else {
          //Sing JWT, valid for 1 hour
          const token = jwt.sign(
            { userId: op.id, username: op.username },
            config.jwtSecret,
            { expiresIn: "1h" }
          );
          //Send the jwt in the response
          let response = {
            token: token,
            operatore: op//.role
          }
          res.status(200).send(response)
        }
      }).catch((e) => {
        res.status(500).send(e)
      })
  }

  static changePassword = async (req: Request, res: Response) => {
    //Get ID from JWT
    const id = res.locals.jwtPayload.userId;

    //Get logeters from the body
    const { oldPassword, newPassword } = req.body;
    if (!(oldPassword && newPassword)) {
      res.status(400).send();
    }

    //Get operatore from the database
    const userRepository = myDataSource.getRepository(Operatore);
    let operatore: Operatore;
    try {
      operatore = await userRepository.findOneOrFail(id);
    } catch (id) {
      res.status(401).send();
    }

    //Check if old password matchs
    if (!operatore.checkIfUnencryptedPasswordIsValid(oldPassword)) {
      res.status(403).send("old password not matching");
      return;
    }

    //Validate de model (password lenght)
    operatore.password = newPassword;
    const errors = await validate(operatore);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }
    //Hash the new password and save
    operatore.hashPassword();
    userRepository.save(operatore);

    res.status(200).send("Password changed successfully");
  };
  static changeLostPassword = async (req: Request, res: Response) => {
    //Get ID from JWT
    const id = res.locals.jwtPayload.userId;

    //Get logeters from the body
    const { password } = req.body;
    //Get operatore from the database
    const userRepository = myDataSource.getRepository(Operatore);
    let operatore: Operatore;
    try {
      operatore = await userRepository.findOneOrFail(id);
    } catch (id) {
      res.status(401).send();
    }

    //Validate de model (password lenght)
    operatore.password = password;
    const errors = await validate(operatore);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }
    //Hash the new password and save
    operatore.hashPassword();
    userRepository.save(operatore);

    res.status(200).send("Password changed successfully");
  };

  static generateTemporaryToken = async (req: Request, res: Response) => {

    const username = req.body.username
    const destURL = req.body.destURL
    myDataSource.getRepository(Operatore).findOneOrFail({ where: { username: username } }).then(async operatore => {

      //Sing JWT, valid for 10 min

      const token = jwt.sign(

        { userId: operatore.id, username: operatore.username },
        config.jwtSecret,
        { expiresIn: "10m" }
      );
      /* await sendMailRecoveryPwd(operatore.username, "", "a.sagliano@viniexport.com", "Reset Password", operatore.id, token, destURL, req.headers.host).
        then(() => {
          res.status(200).send(token)
        })
        .catch((err) => {
          res.status(500).send(err)
        }) */

    })
      .catch(err => {
        res.status(500).send("Username not found")


      })

  };


  static checkToken = async (req: Request, res: Response) => {

    const { username } = req.query
    const token = <string>req.headers["auth"];

    let jwtPayload;
    //Try to validate the token and get data
    try {
      jwtPayload = <any>jwt.verify(token, config.jwtSecret);
      res.locals.jwtPayload = jwtPayload;
    } catch (error) {
      //If token is not valid, respond with 401 (unauthorized)
      res.status(401).send();
      return;
    }

    myDataSource.getRepository(Operatore).findOneOrFail({ where: { username: username.toString() } }).then(async operatore => {

      if (operatore.username == username && username == res.locals.jwtPayload.username) {
        res.status(200).send()
      } else {
        res.status(401).send()
      }
    }).catch(() => {
      res.status(500).send("Operatore not Found")
    })

  };

}
export default AuthController;