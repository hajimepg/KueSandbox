const test = require("ava");

test("createQueue", (t) => {
    return new Promise((resolve, reject) => {
        t.plan(0);

        const kue = require("kue");
        const queue = kue.createQueue();

        queue.create("email", {
            title: "title",
            to: "hajime@studiohff.net",
            template: "test"
        }).save((error) => {
            if (error !== null) {
                reject(error);
            }

            resolve();
        });
    });
});
