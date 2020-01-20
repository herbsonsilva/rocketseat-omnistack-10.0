const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray')

module.exports = {

    async index(request, response) {
        const devs = await Dev.find();

        return response.json(devs);
    },

    async store(request, response) {
        const { github_username, techs, latitude, longitude } = request.body;

        let dev = await Dev.findOne({ github_username });

        if (dev) {
            return response.json({ message: 'Dev já cadastrado!' });
        }else{
            const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);    
    
            // console.log(apiResponse.data);
            const { name = login, bio, avatar_url  } = apiResponse.data;
            // console.log(name, github_username, bio, avatar_url );
        
            const techArray = parseStringAsArray(techs);
        
            const location = {
                type: 'Point',
                coordinates: [longitude, latitude],
            }
        
            dev = await Dev.create({
                name,
                github_username,
                bio,
                avatar_url,
                techs: techArray,
                location
            })
        }
    
        return response.json({message: 'Dev cadastrado com sucesso!', dev});
    },
    
    async update(request, response) {
        const { github_username, techs, latitude, longitude } = request.body;

        let dev = await Dev.findOne({ github_username });

        if (dev) {
            const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);    

            const { name = login, bio, avatar_url  } = apiResponse.data;
        
            const techArray = parseStringAsArray(techs);
        
            const location = {
                type: 'Point',
                coordinates: [ longitude, latitude ],
            }
        
            dev = await Dev.update({
                name,
                bio,
                avatar_url,
                techs: techArray,
                location
            });
        }else{
            return response.json({ message: 'Dev não localizado!' });
        }
    
        return response.json({message: 'Dev atualizado com sucesso!', dev});
    },

    async delete(request, response) {
        const devs = await Dev.find();

        return response.json(devs);
    },
}