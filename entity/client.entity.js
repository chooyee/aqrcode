module.exports = (sequelize, DataTypes) => {
    const client = sequelize.define("client", {
        md5: DataTypes.TEXT,          
        request: DataTypes.TEXT,
        qrcode: DataTypes.TEXT,
        longurl: DataTypes.TEXT,
        tinyurl: DataTypes.TEXT,
        
    });
        
    // (async () => {
    // await sequelize.sync({ force: true });
    //     // Code here
    // })();
    return client;
}