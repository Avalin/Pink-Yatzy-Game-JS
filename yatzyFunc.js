/**
 * Created by maora on 03-10-2016.
 */

var root = "https://krdo-high-score.herokuapp.com/api/highscores/";
var username = prompt("Hej! Velkommen til Yatzy! Hvad hedder du?");
username = username.substring(0, 30);
if(username == "")
{
    username = "Anonym";
}

$.getJSON(root + "avanik", function(object)
{
    for(var i = 0; i < object.length; i++)
    {
        name = object[i]["name"];
        score = object[i].score;
        $("#highscores ol").append("<li><u> " + name + ":</u> " + score + "</li>");
    }
});

var yz =
{
    dice: [0, 0, 0, 0, 0],
    heldDice: [false, false, false, false, false],
    turns: 0,
    valuesClicked: 0,

    isGameOver: function()
    {
        //Er spillet færdigt? + Highscore Check
        setTimeout(function() //Timeout så animationerne vises før dialogs
        {
            if(yz.valuesClicked == 15)
            {
                var wantHighscore = confirm("Tillykke, " + username + "! du fik en samlet score på " + $("#total").val() + " point!\nØnsker du at sende din score til highscorelisten?");
                if(wantHighscore)
                {
                    //Upload highscore
                    $.post(root + "avanik", {"secret": "nikava", "name": username, "score":  $("#total").val()});
                    {

                    }
                }

                var replay = confirm("Vil du prøve igen?");
                if(replay)
                {
                    window.location.reload()
                }
                else
                {
                    window.close();
                }
            }
        }, 100);
    }
};

var calc =
{
    getDiceValues: function()
    {
        for(var i = 0; i < yz.dice.length; i++)
        {
            if(!yz.heldDice[i])
            {
                yz.dice[i] = Math.floor(Math.random() * 6) + 1;
            }
        }
    },

    amountOfEachDieVal: function() //Checks each die value and how many times it appears in the throw
    {
        var sameDieVal = [0, 0, 0, 0, 0, 0];
        for (var i = 0; i < 5; i++)
        {
            sameDieVal[yz.dice[i] - 1]++;
        }
        return sameDieVal;
    },

    valueSpecificFace: function(dieVal) //Lægger værdierne ind for antal terninge værdi
    {
        return calc.amountOfEachDieVal()[dieVal-1] * dieVal;
    },

    valueManyOfAKind: function(amountDieVal)
    {
        sameDieVal = calc.amountOfEachDieVal();
        for (var i = sameDieVal.length; i > -1; i--) //Nedadgående så højeste værdi returneres
        {
            if (sameDieVal[i] >= amountDieVal)
            {
                return (i + 1) * amountDieVal;
            }
        }
        return 0;
    },

    valueOnePair: function()
    {
        return calc.valueManyOfAKind(2);
    },

    valueTwoPair: function()
    {
        var pair1 = -1;
        var pair2 = -1;
        sameDieVal = calc.amountOfEachDieVal();
        for (var i = sameDieVal.length; i > -1; i--) //Nedadgående så højeste værdi returneres
        {
            if (sameDieVal[i] >= 2) {
                pair1 = (i + 1);
            }
        }

        for (i = sameDieVal.length; i > -1; i--) //Nedadgående så højeste værdi returneres
        {
            if (sameDieVal[i] >= 2 && pair1 != (i + 1)) {
                pair2 = (i + 1);
            }
        }

        if (pair1 != -1 && pair2 != -1)
        {
            return (pair1 * 2) + (pair2 * 2);
        }
        return 0;
    },

    value3Same: function()
    {
        return calc.valueManyOfAKind(3);
    },

    value4Same: function()
    {
        return calc.valueManyOfAKind(4);
    },

    fullHouse: function()
    {
        var pair1 = -1;
        var pair2 = -1;
        sameDieVal = calc.amountOfEachDieVal();
        for (var i = sameDieVal.length; i > -1; i--) //Nedadgående så højeste værdi returneres
        {
            if (sameDieVal[i] >= 3) {
                pair1 = (i + 1);
            }
        }

        for (i = sameDieVal.length; i > -1; i--) //Nedadgående så højeste værdi returneres
        {
            if (sameDieVal[i] >= 2 && pair1 != (i + 1))
            {
                pair2 = (i + 1);
            }
        }

        if (pair1 != -1 && pair2 != -1)
        {
            return (pair1 * 3) + (pair2 * 2);
        }
        return 0;
    },

    valueSmallStraight: function()
    {
        var sameDieVal = calc.amountOfEachDieVal();
        for (var i = 0; i < yz.dice.length; i++)
        {
            if (yz.dice[i] == 6 || sameDieVal[i] != 1)
            {
                return 0;
            }
        }
        return 15;
    },

    valueLargeStraight: function()
    {
        var sameDieVal = calc.amountOfEachDieVal();
        for (var i = 1; i < yz.dice.length; i++)
        {
            if (yz.dice[i] == 1 || sameDieVal[i] != 1)
            {
                return 0;
            }
        }
        return 20;
    },

    valueChance: function()
    {
        var chance = 0;
        for (var i = 0; i < yz.dice.length; i++)
        {
            chance += yz.dice[i];
        }
        return chance;
    },

    valueYatzy: function()
    {
        if (calc.valueManyOfAKind(5) != 0)
        {
            return 50;
        }
        return 0;
    }
};