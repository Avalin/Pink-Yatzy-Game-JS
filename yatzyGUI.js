/**
 * Created by maora on 30-09-2016.
 */
$(function()
{
    $("#brugernavn").val(username);
    //Mår terningerne kastes
    $("#rollDice").on('click', function()
    {
        roll();
    });

    $(this).on('keypress', function(e)
    {
        if(e.which == 13 || event.keyCode ==13)
        {
            roll();
        }
    });

    function roll()
    {
        function avoidAnimatingHeld(object, index, ani)
        {
            if(!yz.heldDice[index] && yz.turns != 3) //Animer når terningerne ikke er held og tur 3 ikke er nået
            {
                object.html('<img src="DieAnimation' + ani + '.gif">');
            }
        }

        avoidAnimatingHeld($("#first"), 0, 1);
        avoidAnimatingHeld($("#second"), 1, 2);
        avoidAnimatingHeld($("#third"), 2, 1);
        avoidAnimatingHeld($("#fourth"), 3, 2);
        avoidAnimatingHeld($("#fifth"), 4, 1);

        //Indsætter værdierne i GUIen efter animationen
        setTimeout(function()
        {
            if(yz.turns != 3)
            {
                yz.turns++;
                $("#turns").html("<b>" + "Slag: " + "</b>" + yz.turns);

                calc.getDiceValues();

                $("#first").html('<img src="Die' + yz.dice[0] + '.PNG">');
                $("#second").html('<img src="Die' + yz.dice[1] + '.PNG">');
                $("#third").html('<img src="Die' + yz.dice[2] + '.PNG">');
                $("#fourth").html('<img src="Die' + yz.dice[3] + '.PNG">');
                $("#fifth").html('<img src="Die' + yz.dice[4] + '.PNG">');

                insertAllValues();
            }
        }, 500);
    }

    function insertValue(object, method)
    {
        if(!object.data("clicked")) //Er værdien fastlåst?
        {
            object.val(method);
            object.prop("disabled", false);
        }
    }

    function insertAllValues()
    {
        insertValue($("#1s"), calc.valueSpecificFace(1));
        insertValue($("#2s"), calc.valueSpecificFace(2));
        insertValue($("#3s"), calc.valueSpecificFace(3));
        insertValue($("#4s"), calc.valueSpecificFace(4));
        insertValue($("#5s"), calc.valueSpecificFace(5));
        insertValue($("#6s"), calc.valueSpecificFace(6));
        insertValue($("#1par"), calc.valueOnePair());
        insertValue($("#2par"), calc.valueTwoPair());
        insertValue($("#3ens"), calc.value3Same());
        insertValue($("#4ens"), calc.value4Same());
        insertValue($("#lilleStraight"), calc.valueSmallStraight());
        insertValue($("#storStraight"), calc.valueLargeStraight());
        insertValue($("#fuldtHus"), calc.fullHouse());
        insertValue($("#chance"), calc.valueChance());
        insertValue($("#yatzy"), calc.valueYatzy());
    }

    //Tjekker om dices bliver holdt
    isDiceHeld($("#first"), 0);
    isDiceHeld($("#second"), 1);
    isDiceHeld($("#third"), 2);
    isDiceHeld($("#fourth"), 3);
    isDiceHeld($("#fifth"), 4);

    function isDiceHeld(object, die)
    {
        object.on('click', function()
        {

            if (!yz.heldDice[die] && yz.dice[die] != 0)
            {
                object.animate().fadeTo('fast', 0.5);
                yz.heldDice[die] = true;
            }

            else
            {
                object.animate().fadeTo('fast', 1.0);
                yz.heldDice[die] = false;
            }

        });
    }

    //Valg af værdi efter terningekast
    function chooseValue(object, isSummable)
    {
        object.one('click', function()
        {
            object.animate().fadeTo('fast', 0.5);
            object.data('clicked', true); //Så værdien fastlåses ved kast
            $("#total").val(Number($("#total").val()) + Number(object.val()));
            if(isSummable)
            {
                $("#sum").val(Number($("#sum").val()) + Number(object.val()));
                var bonus = 0;
                var sum = $("#sum").val();
                if(sum >= 63)
                {
                    $("#bonus").val(50);
                    bonus = $("#bonus").val();
                }
                $("#total").val(Number($("#total").val()) + Number(bonus));
            }
            afterValueChosen();
        });
    }

    chooseValue($("#1s"), true);
    chooseValue($("#2s"), true);
    chooseValue($("#3s"), true);
    chooseValue($("#4s"), true);
    chooseValue($("#5s"), true);
    chooseValue($("#6s"), true);
    chooseValue($("#1par"), false);
    chooseValue($("#2par"), false);
    chooseValue($("#3ens"), false);
    chooseValue($("#4ens"), false);
    chooseValue($("#lilleStraight"), false);
    chooseValue($("#storStraight"), false);
    chooseValue($("#fuldtHus"), false);
    chooseValue($("#chance"), false);
    chooseValue($("#yatzy"), false);


    function afterValueChosen()
    {
        yz.turns = 0;
        yz.dice = [0, 0, 0, 0, 0];
        $("#turns").html("<b>" + "Slag: " + "</b>" + yz.turns);
        $("#first").html('<img src="Die0.PNG">');
        $("#second").html('<img src="Die0.PNG">');
        $("#third").html('<img src="Die0.PNG">');
        $("#fourth").html('<img src="Die0.PNG">');
        $("#fifth").html('<img src="Die0.PNG">');

        function resetValue(object)
        {
            insertValue(object, "0");
            object.prop("disabled", true);
        }

        function resetDie(object, dieVal) //Virkede ikke med loop, så funktion...
        {
            yz.heldDice[dieVal] = false;
            object.animate().fadeTo('fast', 1.0);
        }

        resetValue($("#1s"));
        resetValue($("#2s"));
        resetValue($("#3s"));
        resetValue($("#4s"));
        resetValue($("#5s"));
        resetValue($("#6s"));
        resetValue($("#1par"));
        resetValue($("#2par"));
        resetValue($("#3ens"));
        resetValue($("#4ens"));
        resetValue($("#lilleStraight"));
        resetValue($("#storStraight"));
        resetValue($("#fuldtHus"));
        resetValue($("#chance"));
        resetValue($("#yatzy"));

        resetDie($("#first"), 0);
        resetDie($("#second"), 1);
        resetDie($("#third"), 2);
        resetDie($("#fourth"), 3);
        resetDie($("#fifth"), 4);
        yz.valuesClicked++;
        yz.isGameOver();
    }

    $("#toggleHS").click(function()
    {
        $("#highscores").animate().fadeToggle();
    });

    $("#toggleRules").click(function()
    {
        $("#rules").animate().fadeToggle();
    });
});