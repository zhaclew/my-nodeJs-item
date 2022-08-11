const mongoose = require('mongoose')

// 限定模式类型
const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, '需要填入姓名'],
        unique: true,
        trim: true
    },
    slug: String,
    duration: {
        type: Number,
        required: [true, '需要填入持续时间'],
    },
    maxGroupSize: {
        type: Number,
        required: [true, '需要填入最大的报名人数'],
    },
    rating: {
        type: Number,
        default: 4.5,
        max: 5,
        min: 1
    },
    ratingAverage: {
        type: Number,
        default: 4.5
    },
    ratingQuantity: {
        type: Number,
        default: 0
    },
    difficulty: {
        type: String,
        required: [true, "需要填入难易度"],
        enum: {
            values: ['简易级', '普通级', '困难级', '地狱级'],
            message: '难易度设置错误'
        }
    },
    evaluate: { type: String },
    price: {
        type: Number,
        required: [true, "需要填入价格"]
    },
    priceDiscount: {
        type: Number,
        validate: {
            validator: function (val) {
                return val < this.price
            },
            message: '折扣价格不得大于原本价格'
        }
    },
    summary: {
        type: String,
        trim: true,
        required: [true, "需要填入详情"]
    },
    details: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, "需要填入图片路径"]
    },
    images: [String],
    creationTime: {
        type: Date,
        default: Date.now(),
        select: false
    },
    startTime: [Date]
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
)

tourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7
})

// 使用中间件 save 钩子在保存文档前修改文档
tourSchema.pre("save", function (next) {
    this.slug = this.name + "☆☆☆"
    next()
})

const Tour = mongoose.model('Tour', tourSchema)

module.exports = Tour
