const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

function isNumber(str){
    return !isNaN(str) && !isNaN(parseFloat(str)) && isFinite(str);
}

function isAlpha(str){
    return /^[a-zA-Z]$/.test(str);
}

function isSpecial(str){
    return !/^[a-zA-Z0-9]$/.test(str);
}

function createConcatenatedString(input){
    let alphabetical = [];
    input.forEach((item) =>{
        const itemStr = String(item);
        for(let char of itemStr){
            if(isAlpha(char)){
                alphabetical.push(char);
            }
        }
    });
    alphabetical.reverse();
    let result = '';
    for(let i=0;i<alphabetical.length;i++){
        if(i%2 == 0){
            result += alphabetical[i].toUpperCase();
        }else{
            result += alphabetical[i].toLowerCase();
        }
    }
    return result;
}

app.post('/bfhl',(req,res)=>{
    try{
        const { data } = req.body;
        if(!data || !Array.isArray(data)){
            return res.status(400).json({
                "is_success": false,
                "error": "Invalid input - data must be an array"
            });
        }
        let evenNum = [], oddNum = [], alphabets = [], specialChar = [], numSum = 0;
        data.forEach((item)=>{
            const itemStr = String(item);
            if(isNumber(itemStr)){
                const num = parseInt(itemStr);
                (num % 2 == 0) ? evenNum.push(itemStr) : oddNum.push(itemStr);
                numSum += num;
            }else if(itemStr.split('').every(char => isAlpha(char))){
                alphabets.push(itemStr.toUpperCase());
            }else if(itemStr.length === 1 && isSpecial(itemStr)){
                specialChar.push(itemStr);
            }else{
                for(let char of itemStr){
                    if(isNumber(char)){
                        const num = parseInt(char);
                        if (num % 2 === 0) {
                            evenNum.push(char);
                        } else {
                            oddNum.push(char);
                        }
                        numSum += num;
                    }else if(isAlpha(char)){
                        alphabets.push(char.toUpperCase());
                    }else if(isSpecial(char)){
                        specialChar.push(char);
                    }
                }
            }
        });
        const concatString = createConcatenatedString(data);
        const response = {
            "is_success": true,
            "user_id": process.env.USER_ID || "sai_puneeth_balaji_22042005",
            "email": process.env.EMAIL || "saipuneethbalaji@gmail.com",
            "roll_number": process.env.ROLL_NUMBER || "22BCE1478",
            "odd_numbers": oddNum,
            "even_numbers": evenNum,
            alphabets,
            "special_characters": specialChar,
            "sum": String(numSum),
            "concat_string": concatString
        };
        res.status(200).json(response);
    }catch(error){
        console.log("Error processing request", error);
        res.status(500).json({
            is_success: false,
            error: "Internal Server Error",
        });
    }
});

app.get("/bfhl",(req,res)=>{
    res.status(200).json({
        "operational" : true,
        "status": "Process running succesfully",
        timeStamp: new Date().toISOString(),
    });
});

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'BFHL API Server is running',
        endpoints: {
            'POST /bfhl': 'Main processing endpoint',
            'GET /bfhl': 'Returns operation code and health checks',
        }
    });
});

app.listen(PORT,(req,res)=>{
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;