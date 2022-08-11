// 封装一个异步错误捕捉功能
module.exports = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch(next)
    }
}
