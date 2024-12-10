import { TravelReport } from ".";

; (async function init() {

    setTimeout(async () => {
        const r = new TravelReport();
        await r.prepare();

        const results = r.years();

        console.log("results:", results);

        const summary = r.summary();

        console.log("summary:", summary)

    }, 2000)


})()
