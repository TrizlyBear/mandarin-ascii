const express = require('express')
var app = express()
var j = require('jimp')
var cors = require('cors')
var axios = require('axios')
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
var result;
var brightnes = ['麵', '糖','挂','搭','黄','咸','旁','底','河','走','张','言','长','加','月','点','长','当','大','字','马','月','口','心','八']



function bright(color) {
    var r, g, b, hsp;
        r = color.r
        g = color.g
        b = color.b
    hsp = Math.sqrt(
    0.299 * (r * r) +
    0.587 * (g * g) +
    0.114 * (b * b)
    );
    return hsp;
}


app.get('/',function(req,res) {
    res.sendFile(__dirname+'/index.html')
})

app.post('/img', function(req, res) {
    // console.log(req.body.contrast)
    axios.get(req.body.iurl).then(res => {
          if (!res.headers["content-type"].split('/')[0] == 'image') {
            
            res.send('Please provide a valid URL.')
        }else{
            transform(req.body.iurl, req.body.contrast)
        }  
        
        
    }).catch(e => {
        // console.log(e)
        res.send('Please provide a valid URL.')
    })
    
function transform(imgurl, contrast) {
        j.read(imgurl, (err, pic) => {
        pic.resize(100,j.AUTO)
        if (contrast) {
            try {
                pic.contrast(parseInt(contrast));   
            } catch (error) {
                res.send('This contrast is invalid')
                return;
            }
          
        }
          
        var heigthc = 1
        var widthc = 0
        var result = []
        var currentrow = []
        while (heigthc < pic.bitmap.height) {
            
            if (pic.bitmap.width < widthc) {
                widthc = 0
                heigthc++;
                result.push(currentrow)
                
                currentrow = []
            } else {
                if (Math.floor(bright(j.intToRGBA(pic.getPixelColor(widthc,heigthc)))/10) > 24) {
                    currentrow.push(brightnes[24])
                            
                }else{
                    currentrow.push(brightnes[Math.floor(bright(j.intToRGBA(pic.getPixelColor(widthc,heigthc)))/10)])
                } 
                widthc++;
            }
           
        }
        while(heigthc == pic.bitmap.height) {
            heigthc++
            res.send(Array.from(result.join('</br>').split(',')).join(''));
        }
        
    })
}
    
    
    
})

app.listen(process.env.PORT || 6969)
