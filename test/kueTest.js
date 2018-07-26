import test from "ava";
import kue from "kue";

test("callback to other instance", (t) => {
    return new Promise((resolve, reject) => {
        const queue = kue.createQueue();

        const job = queue.create("test", {});

        job.save((error) => {
            if (error !== null) {
                reject(error);
            }

            kue.Job.get(job.id, "test", (error, sameJobOtherInstance) => {
                if (error !== null) {
                    reject(error);
                }

                t.is(job.id, sameJobOtherInstance.id);

                const callbackHistory = [];
                job.on("complete", () => { callbackHistory.push("job"); });
                sameJobOtherInstance.on("complete", () => { callbackHistory.push("sameJobOtherInstance"); });

                setTimeout(() => {
                    t.true(callbackHistory.includes("job"));
                    t.true(callbackHistory.includes("sameJobOtherInstance"));
                    resolve();
                }, 100);
            });
        });

        queue.process("test", 1, (job, done) => {
            done();
        });
    });
});
