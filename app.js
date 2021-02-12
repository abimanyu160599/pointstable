const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");



mongoose.connect("mongodb+srv://Admin-Abimanyu:Test123@cluster0.cumxh.mongodb.net/teamsdb");

const teamschema = {
  name : String,
  points:{
    type:Number,
    default:0
  },
  win:{
    type:Number,
    default:0
  },
  tie :{
    type:Number,
    default:0
  },
  lose :{
    type:Number,
    default:0
  }
}

const Teammodel = mongoose.model("Teamgroup", teamschema);


app.set('view engine','ejs');

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
                        var match = {}
                         //&& req.query.search!= ""
                        if(req.query.search ){
                          match.points = req.query.search;
                        }
                        Teammodel.find(match,function(err,foundTeam){
                        if(err){
                          console.log("error");
                        }
                          else{
                              res.render("team",{teamName:foundTeam});
                          }
                        }).sort({points:-1})

                        });

app.post("/",function(req,res){

                        var enteredname = req.body.input;
                        Teammodel.find({name:enteredname},function(err,duplicate){
                          if(err){
                            console.log("err");
                          }
                          else{
                                if(duplicate.length!=0){
                                  res.redirect("/");
                                  // res.send('<script>alert("team already exists")</script>');
                                }
                                else{
                                  const team1 = new Teammodel({
                                    name : enteredname
                                  });
                                  team1.save();
                                  res.redirect("/");
                                }
                          }
                        });


                        });

app.get("/match", function(req,res){
            Teammodel.find(function(err,foundTeam){
            if(err){
              console.log("error");
            }
              else{
                  res.render("match",{teamName:foundTeam});
              }
          });
        });

app.post("/match",async(req,res)=>{

            var firstteamname = req.body.winnername;
            var secondteamname = req.body.losername;

            var result = firstteamname.localeCompare(secondteamname);
            if(result!=0)
            {
              if(req.body.tie=="no")
              {
                var winningTeam = req.body.winner;
                var losingTeam =  req.body.loser;

                var onlypoint= await Teammodel.findOne({name:winningTeam});
                var pointOfWinner = onlypoint.points;
                var numofwin = onlypoint.win;
                var updatedPoint = pointOfWinner + 3;
                var updatedwin = numofwin + 1;
                await Teammodel.updateOne({name :winningTeam},{points: updatedPoint,win:updatedwin});

                var separatedataofloser= await Teammodel.findOne({name:losingTeam});
                var numofloseofloser = separatedataofloser.lose;
                var updatednumoflose = numofloseofloser + 1;
                await Teammodel.updateOne({name:losingTeam},{lose:updatednumoflose});
              }
              else
              {
                var firstteamname = req.body.winnername;
                var secondteamname = req.body.losername;
                var onlypointone= await Teammodel.findOne({name:firstteamname});
                var pointOfWinnerone = onlypointone.points;
                var tieofteamone = onlypointone.tie;
                var updatedPointone = pointOfWinnerone + 1;
                var updatedtie = tieofteamone +1;
                await Teammodel.updateOne({name :firstteamname},{points: updatedPointone, tie:updatedtie});

                var onlypointtwo =await Teammodel.findOne({name:secondteamname});
                var pointOfloser = onlypointtwo.points;
                var tieofteamtwo = onlypointtwo.tie;
                var updatedPointtwo = pointOfloser + 1;
                var updatedtieofteamtwo = tieofteamtwo + 1;
                await Teammodel.updateOne({name:secondteamname},{points:updatedPointtwo,tie:updatedtieofteamtwo});
              }
              res.redirect("/");
            }
            else
            {
              res.redirect("/match");
            }
        });

app.post("/delete",function(req,res){
var deleteditem = req.body.delete;
Teammodel.findOneAndDelete({name:deleteditem},function(err){
  if(err){
    console.log("not deleted");
  }
});
res.redirect("/");
res.end();
});

let port = process.env.PORT;
if (port == null || port == ""){
  port= 3000;
}


app.listen(port,function(){
  console.log("port is running");
});
