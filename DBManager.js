function execute(query) {
    const pg = require("pg");

    const config = {
        user: "postgres",
        password: "postgres",
        host: "localhost",
        database: "nodejs",
        port: "5432"
    };

    const client = new pg.Client(config);

    client.connect(e => {
        if (e) { throw e; }
    });

    return client.query(query)
        .catch(e => console.error(e.stack))
        .finally(() => client.end());
}

module.exports.execute = execute;