var numberOfplayers;
var currentPlayer;
var colors = 
{
    p1 : "red",
    p2 : "yellow",
    p3 : "blue",
    p4 : "green"
}

$(document).ready(function()
{
    $("#start").click(function()
    {
        numberOfplayers = $("#numberOfPlayers").val();
        start();
    });
});

function start()
{
    $("#controls").hide();
    $("#grid").show();

    var cellWidth = ($("#grid").width() - 20)/25;
    var cellHeight = $("#grid").height()/25;

    for(var i = 1; i <= cellHeight; i++)
    {
        var row = "<div>";
        for(var j = 1; j <= cellWidth; j++)
        {
            var position = "";
            if(i == 1 || i == cellHeight || j == 1 || j == cellWidth)
            {
                if((i == 1 && j == 1) || (i == 1 && j == cellWidth) || (i == cellHeight && j == 1) || (i == cellHeight && j == cellWidth))
                    position = "corner";
                else
                    position = "edge";
            }
            else
                position = "";
            row += "<div class='cell "+position+" empty' id='"+i+"-"+j+"'><span></span><span></span><span></span><span class='left'></span><span class='right'></span><span class='up'></span><span class='down'></span></div>";
        }
        row += "</div>";
        $("#grid").append(row);
    }

    $(".cell").click(function()
    {
        currentPlayer = $("#grid").attr("class").replace("p", "");
        if(!$(this).hasClass("empty") && !$(this).hasClass("p" + currentPlayer))
            return false;

        splitOrConquer(this);

        currentPlayer++;
        if(currentPlayer > numberOfplayers)
            currentPlayer = 1;
        
        $("#grid").attr("class", "");
        $("#grid").attr("class", "p"+currentPlayer);
    });
}

function splitOrConquer(cell, direction)
{
    if(undefined == cell)
        return false;

    if($(cell).attr("class").match(/p[1-4]/g) != null)
        $(cell).removeClass($(cell).attr("class").match(/p[1-4]/g).join(" "));
    if($(cell).hasClass("empty"))
    {
        $(cell).removeClass("empty");
        $(cell).addClass("one p" + currentPlayer);
    }
    else if($(cell).hasClass("one"))
    {
        if($(cell).hasClass("corner"))
            splitCell($(cell).attr("id"));
        else
        {
            $(cell).removeClass("one");
            $(cell).addClass("two p" + currentPlayer);
        }
    }
    else if($(cell).hasClass("two"))
    {
        if($(cell).hasClass("edge"))
            splitCell($(cell).attr("id"));
        else
        {
            $(cell).removeClass("two");
            $(cell).addClass("three p" + currentPlayer);
        }
    }
    else if($(cell).hasClass("three"))
    {
        $(cell).find("span.down, span.left, span.right, span.up").show();
        $(cell).find("span.left").animate({display : 'block', left: '-16px'}, 250);
        $(cell).find("span.right").animate({display : 'block', left: '35px'}, 250);
        $(cell).find("span.up").animate({display : 'block', top: '-16px'}, 250);
        $(cell).find("span.down").animate({display : 'block', top: '35px'}, 250, function()
        {
            $(cell).find("span.down, span.left, span.right, span.up").css({top : '9px', left : '9px', display : 'none'});
        });
        splitCell($(cell).attr("id"));
    }
}

function splitCell(position)
{
    $(".cell#"+position).removeClass("one two three p"+currentPlayer).addClass("empty");
    let i = parseInt(position.split("-")[0]);
    let j = parseInt(position.split("-")[1]);
    conquerCells(i-1, j, "up");
    conquerCells(i+1, j, "down");
    conquerCells(i, j-1, "left");
    conquerCells(i, j+1, "right");
}

function conquerCells(i, j, direction)
{
    splitOrConquer($("#"+i+"-"+j)[0], direction);
}