const User = require('../models/User');
const jwt = require('jsonwebtoken');

// exports.createUser = async (req, res) => {
//
//     let genders = ["male","female","bi-sexual","transgender"];
//     let gender = genders[Math.floor(Math.random() * genders.length)];
//
//     let ages = [18,20,24,26,27,32,35,45,50,55,60,65];
//     let age = ages[Math.floor(Math.random() * ages.length)]
//
//     let preferences = [];
//     let size = Math.floor(Math.random() * (genders.length));
//
//     for (let i = 0; i < size; i++) {
//         let gender = Math.floor(Math.random() * genders.length);
//         if (!preferences.includes(genders[gender])) {
//             preferences.push(genders[gender]);
//         }
//     }
//
//     let latitude = 28.6832091-0.1+Math.random()*(28.6832091+0.1-(28.6832091-0.1));
//     let longitude = 77.3177894-0.1+Math.random()*(77.3177894+0.1-(77.3177894-0.1));
//
//     let randomIndex = Math.floor(Math.random() * genders.length);
//     let randomGender = genders[randomIndex];
//
//     try {
//         const newUser = new User({
//             name: falso.randFullName(),
//             gender: gender,
//             age: age,
//             location: {
//                 type: 'Point',
//                 coordinates: [longitude, latitude]
//             },
//             preferences: {
//                 minAge: Math.floor(Math.random() * (25 - 18 + 1)) + 18,
//                 maxAge: Math.floor(Math.random() * (65 - 26 + 1)) + 26,
//                 gender: randomGender
//             }
//         });
//         await newUser.save();
//         res.status(201).json(newUser);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

const SECRET_KEY = "jwtTokenKey";

exports.matches = async (req, res) => {
    const { radius, genderPreference } = req.query;

    if (!radius || isNaN(radius)) {
        return res.status(400).json({ message: 'Invalid radius' });
    }

    // Extract the token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'No token provided'});
    }

    const token = authHeader.split(' ')[1];

    // Verify the token
    let decoded;
    try {
        decoded = jwt.verify(token, SECRET_KEY, { algorithms: ['HS512'] });
    } catch (err) {
        console.error(err);
        return res.status(401).json({ message: 'Invalid token', error: err.message });
    }

    // Get the user's location
    const user = await User.findOne({ email: decoded.sub });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const latitude = parseFloat(user.latitude);
    const longitude = parseFloat(user.longitude);

    const users = await User.aggregate([
        {
            $addFields: {
                location: {
                    type: 'Point',
                    coordinates: [
                        { $toDouble: "$longitude" },
                        { $toDouble: "$latitude" }
                    ]
                }
            }
        },
        {
            $match: {
                gender: genderPreference,
                location: {
                    $geoWithin: {
                        $centerSphere: [[longitude, latitude], parseInt(radius) / 6371] // radius should be in kilometers
                    }
                }
            }
        },
        {
            $project: {
                location: 0,
                user_id: 0,
                email:0,
                latitude: 0,
                longitude: 0,
            }
        }
    ]);

    res.json(users);
};