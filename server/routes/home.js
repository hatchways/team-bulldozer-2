module.exports = (router) => {

    router.get("/", function (req, res, next) {
        res.status(200).send({ welcomeMessage: "Step 1 (completed)" });
    });

    return router;
}