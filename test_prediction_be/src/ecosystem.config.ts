module.exports = {
    apps: [
        {
            name: "prediction-backend",
            script: "./build/app.js",
            watch: false,
            node_args: "--max-old-space-size=12288 --nouse-idle-notification",
            cron_restart: "25 3 * * *",
            env: {
                "NODE_ENV": "develope",
                "DB_HOST": "localhost",
                "DB_NAME": "prediction_db",
                "DB_USER": "utente0",
                "DB_PASS": "utente",
                "DB_PORT": 5432,
                "APP_PORT": 3001,
                "debug": "true"
            },
            env_prod: {
                "NODE_ENV": "prod",
                "DB_HOST": "localhost",
                "DB_NAME": "prediction_db",
                "DB_USER": "postgres",
                "DB_PASS": "vxdigital_2023",
                "DB_PORT": 5432,
                "APP_PORT": 3001,
                "debug": false
            },
            env_collaudo: {
                "NODE_ENV": "collaudo",
                "DB_HOST": "192.168.1.221",
                "DB_NAME": "prediction_db",
                "DB_USER": "utente0",
                "DB_PASS": "utente",
                "DB_PORT": 49153,
                "APP_PORT": 3001,
                "debug": "false"


            },
        }
    ]
};
//# sourceMappingURL=ecosystem.config.js.map
