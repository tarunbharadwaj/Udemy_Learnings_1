/* -------- Catching Errors in Async Functions by Avoiding Try/Catch -------- */

module.exports = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};
