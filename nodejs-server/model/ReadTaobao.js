var mysql = require('mysql');
var request = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');
var BufferHelper = require('bufferhelper');
var http = require('http')
var D = require('./zuaaDao');
var lineReader = require('line-reader');
var url = "http://ai.taobao.com/auction/edetail.htm?e=RqhaAx2ljUIjmraEDZVrLsOyWtARoJ4vENbBVuy6U6CLltG5xFicOdXrTUTgh9sMDPIwxrc30rhh1by8lpsAT8jaeoaYfTfznyp2GHoJehklBuMTqGLFeW3abJM7sDg2Ra168d6byFII51bhVE9cZg%3D%3D&ptype=100010&from=basic&clk1=7215134d3a22840e5213e188e1472b08&up"
url = "http://redirect.simba.taobao.com/rd?w=unionnojs&f=http%3A%2F%2Fai.taobao.com%2Fauction%2Fedetail.htm%3Fe%3Dq3D99MsF85HebLdhAWchHO1gyZ8YZqhBiLSVUC%252FYQraLltG5xFicOdXrTUTgh9sMDPIwxrc30rhh1by8lpsAT8jaeoaYfTfznyp2GHoJehklBuMTqGLFeW3abJM7sDg2nTiMTUIWxyOhQ2L3%252FuB4bg%253D%253D%26ptype%3D100010%26from%3Dbasic&k=5ccfdb950740ca16&c=un&b=alimm_0&p=mm_22935095_4232302_22250785"

var type_id = 5
var i = 0;

lineReader.eachLine('C:/temp/taobao.txt', function (line, last) {
    line=line.trim()
    if(line=="")
    {return;}
    if (i == 0) {
        type_id = line
    } else {
        readMessage(line)
    }
    i = i + 1;
});
function readMessage(line) {
    D.find({
        url: line
    }, "site_s_url", function (rows) {
        if (rows.length < 1) {
            http.get(line, function (res) {
                if (res.statusCode != 200) {
                    var realurl = res.headers['location']
                    http.get(realurl, function (res1) {
                        var bufferHelper = new BufferHelper();
                        res1.on('data', function (chunk) {
                            bufferHelper.concat(chunk);
                        });
                        res1.on('end', function () {
                            var html = iconv.decode(bufferHelper.toBuffer(), 'UTF-8')
                            var $ = cheerio.load(html);


                            $(".val").each(function(index,item){
                                if(index==0){
                                    oldprice=$(item).text().trim()
                                }else{
                                    newprice=$(item).text().trim()
                                }
                            })
                            if (oldprice > 0 &&newprice > 0) {
                                console.log("读到了")
                                D.insert({
                                    title: $(".header").text().trim(),
                                    url: line,
                                    img: $(".selected-big-img").attr("data-src"),
                                    oldprice: oldprice,
                                    newprice: newprice,
                                    type_id: type_id
                                }, "site_s_url")
                            } else {
                                readMessage(line);
                            }
                        });
                    })
                } else {
                    console.log("here")
                }
            })

        } else {
            console.log("i am here")
        }
    })
}