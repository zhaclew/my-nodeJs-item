const crypto = require('crypto')
const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs');

// 限定模式类型
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, '需要填入姓名']
    },
    email: {
        type: String,
        required: '请填入邮箱地址',
        unique: true,
        validate: [validator.isEmail, '邮箱地址出错']
    },
    photo: String,
    role: {
        type: String,
        enum: ['admin', 'leader', 'user'],
        default: 'user'
    },
    phone: {
        type: String, // 数据类型
        trim: true, // 去两边的空格
        unique: true, // 唯一性
        sparse: true,// 稀疏索引，null时不搜索
        index: true,
        validate: [validator.isMobilePhone, '填入手机号码出错']
    },
    password: {
        type: String,
        required: '请填入密码',
        select: false,
        validate: [validator.isStrongPassword, '密码由大小写英文和数字和特殊字符组成']
    },
    passwordConfirm: {
        type: String,
        required: '确认密码',
        validate: {
            validator: function (el) {
                return el === this.password
            },
            message: '确认密码填写出错'
        }
    },
    passwordCurrent: {
        type: String,
        select: false,
        validate: {
            validator: function (el) {
                return el === this.password
            },
            message: '当前密码填写错误'
        }
    },
    active: {
        type: Boolean,
        default: true,
        select: false
    },
    changePasswordAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date
})
// 过滤删除了自己的用户， 设置成不活跃的那些
userSchema.pre(/^find/, function (next) {
    this.find({ active: { $ne: false } })
    next()
})
// 保存前使用中间件加密密码
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password, 12)
    this.passwordConfirm = undefined
    next()
})
// 比较密码
userSchema.methods.comparePasswords = async function (password, candidatePassword) {
    return await bcrypt.compare(password, candidatePassword)
}
// 检查用户是否更改密码
userSchema.methods.changePassword = function (changeTime) {
    if (this.changePasswordAt) {
        return parseInt(this.changePasswordAt.getTime() / 1000, 10) > changeTime
    }
    return false
}
// 创建重置密码时 token 和保存加密 token
userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    // 设置为10分钟后失效
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000
    return resetToken
}
// 数据更新前的改变密码保存时间，我就是 changePasswordAt: Update
userSchema.pre('save', async function (next) {
    if (!this.isModified('password' || this.isNew)) return next()
    this.changePasswordAt = Date.now() - 1000
    next()
})
const User = mongoose.model('User', userSchema)

module.exports = User
