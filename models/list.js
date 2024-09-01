const mongoose = require("mongoose");
const schema = mongoose.Schema;
const Review = require("./review");

const listSchema = new schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    image: {
        filename: {
            type: String,
            default: "defaultImage"
        },
        url: {
            type: String,
            default:
                "https://plus.unsplash.com/premium_photo-1681422570054-9ae5b8b03e46?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dW5zcGxhc2glMjBhcHB8ZW58MHx8MHx8fDA%3D",
            set: (v) =>
                v === ""
                    ? "https://plus.unsplash.com/premium_photo-1681422570054-9ae5b8b03e46?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dW5zcGxhc2glMjBhcHB8ZW58MHx8MHx8fDA%3D"
                    : v,
        }
    },
    price: {
        type: Number
    },
    location: {
        type: String
    },
    country: {
        type: String
    },
    reviews:[
        {
            type:schema.Types.ObjectId,
            ref: "Review" // Reference the Review model
        }
    ],
    owner: {
        type: schema.Types.ObjectId,
        ref: 'User',  // Ensure this matches the name of the User model
      },
      geometry:{
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
          },
          coordinates: {
            type: [Number],
            required: true
          }
      }

      
});

listSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}})
    }
 
})

const List = mongoose.model("List", listSchema);
module.exports = List;
