const mongoose = require('mongoose');

const hashTagSchema = new mongoose.Schema({
    hashtags: [{
        type: String,
        lowercase: true,
        trim: true,
        validate: {
          validator: function (v) {
            return /^#[\w\d]+$/i.test(v);
          },
          message: props => `${props.value} is not a valid hashtag. Hashtags should start with '#' and only contain letters and numbers.`
        }
      }],
    postId:{type:mongoose.Schema.Types.ObjectId,ref:'Post'}
},{
    timestamps :true
});
const Hashtag = mongoose.model('Hashtag',hashTagSchema);

module.exports = Hashtag;

