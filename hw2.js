var pX, pY;

window.onload = function() {
    var canvas = document.getElementById('main');
    var canvasWidth = canvas.width;
    var canvasHeight = canvas.height;
    var toggle = 0;
    var toggleF = 0;
    var firstX, firstY;
    var tempX, tempY;
    var x1, y1;
    var result = false;
    var count = 0; 
    
    var ctx = canvas.getContext('2d');
    
    document.getElementById('drawFractal').addEventListener("click", function(){Toggle(1); toggle = 0; pX = null; pY = null;});
    document.getElementById('drawTire').addEventListener("click", function(){Toggle(2); toggle = 1; pX = null; pY = null;});
    
    document.getElementById('drawLineF').addEventListener("click", function(){toggleF = 0; pX = null; pY = null;});
    document.getElementById('drawEllipseF').addEventListener("click", function(){toggleF = 1; pX = null; pY = null;});
    
    document.getElementById('thickness').addEventListener("click", function(){pX = null; pY = null;});
    document.getElementById('color').addEventListener("click", function(){pX = null; pY = null;});
    
    document.getElementById('erase').addEventListener("click", function(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    
    document.getElementById("main").addEventListener("click", function(evt) {
        var mousePosition = getMousePosition(canvas, evt);
        var thickness = document.getElementById("thickness").value;
        var color = document.getElementById("color").value;
        ctx.lineWidth = thickness;
        ctx.strokeStyle = color;
        ctx.beginPath();
        switch(toggle) {
            case 0: //Fractal
                //for finding endpoint of 60 degree rotation:
                if(pX == null && pY == null) {
                    pX = parseInt(mousePosition.x);
                    pY = parseInt(mousePosition.y);
                    ctx.fillRect(pX, pY, 1, 1);
                    ctx.stroke();
                } else {
                    var ratio = document.getElementById("Frac_Ratio").value;
                    var iterations = document.getElementById("Frac_Iterations").value;
                    if(iterations < 0) {
                        var error = "Number of iterations must be greater or equal to zero.";
                        throw error;
                    } else if(iterations == 0) {
                        //If no iterations are needed, just draw the line/ellipse.
                        ctx.moveTo(pX, pY);
                        if(toggleF == 0) {
                            ctx.lineTo(mousePosition.x, mousePosition.y);
                        } else if(toggleF == 1) {
                            //use ctx.arc.
                            //tangent 2 is x2 and y2.
                            //starting point is x1 and y1
                            //radius is 1/2 the distance between x1,y1 and x2,y2.
                            //center is x1/y1 + changeX/changeY.
                            //startAngle = Math.atan2(y1 - centerY, x1 - centerX),
                            //endAngle   = Math.atan2(y2 - centerY, x2 - centerX);
                            //which way the angle flips can be changed by flipping the value of bool counter-clockwise.
                            var x2 = parseInt(mousePosition.x);
                            var y2 = parseInt(mousePosition.y);
                            var changeX = x2 - pX;
                            var changeY = y2 - pY;
                            var centerX = pX + (changeX/2);
                            var centerY = pY + (changeY/2);
                            //distance = sqrt((x2 - x1)^2 + (y2 - y1)^2);
                            var radius = parseInt(Math.sqrt(Math.pow(centerX - pX, 2) + Math.pow(centerY - pY, 2)));
                            var startAngle = Math.atan2(pY - centerY, pX - centerX);
                            var endAngle = Math.atan2(y2 - centerY, x2 - centerX);
                            ctx.moveTo(pX, pY);
                            ctx.arc(centerX, centerY, radius, startAngle, endAngle, false);
                        }
                        ctx.stroke();
                        pX = null;
                        pY = null;
                    } else if(iterations > 0) {
                        fractalize(ctx, ratio, iterations, toggleF, pX, pY, parseInt(mousePosition.x), parseInt(mousePosition.y));
                        pX = null;
                        pY = null;
                    }
                }
                
                break;
            case 1: //Tire
                var score = document.getElementById("Tire-Score").value;
                if(score <= 100 && score >= 80) {
                    //draw ellipse where the angle of horizontal rotation increase based on the score.
                    //Use bezierCurveTo
                    //Convert 99 to 1, 98 to 2, 97 to 3
                    var xCenter = parseInt(mousePosition.x);
                    var yCenter = parseInt(mousePosition.y);
                    var radius = 150;
                    var difference = ((100 - score) / 100);
                    //console.log(difference);
                    //var prevX, prevY;
                    //var x, y;
                    var radius_h = radius;
                    //console.log(radius_h);
                    var radius_v = (radius) - (radius * difference);
                    //console.log(radius_v);

                    var circumference = Math.max(radius_h, radius_v);
                    var scaleV = radius_v / circumference;
                    var scaleH = radius_h / circumference;
                    
                    ctx.save();
                    ctx.scale(scaleH, scaleV);
                    ctx.beginPath();
                    
                    ctx.arc(xCenter, yCenter, radius, 0, (2 * Math.PI), true);
                    ctx.stroke();
                    ctx.restore();
                    
                } else if(score > 0) {
                    //Draw a circlular tire made from a (# of points)-sided polygon
                    //x = xc + r*cos(angle)
                    //y = yc + r*sin(angle)
                    // Radius of 200 default.
                    //xC and yC are the point on the canvas the user clicks.
                    var sides = score;
                    var degree_of_rotation = (360 / sides);
                    var xCenter = parseInt(mousePosition.x);
                    var yCenter = parseInt(mousePosition.y);
                    var radius = 150;
                    var prevX, prevY;
                
                    ctx.beginPath();
                    var current_d = degree_of_rotation;
                    while(sides != 0) {
                        if(sides == score) {
                            prevX = xCenter + radius;
                            prevY = yCenter;
                            ctx.moveTo(prevX, prevY);
                        }
                        var radians = (current_d * (Math.PI / 180));
                        x = xCenter + (radius * Math.cos(radians));
                        y = yCenter + (radius * Math.sin(radians));
                        ctx.lineTo(x, y);
                        current_d = current_d + degree_of_rotation;
                        sides = sides - 1;
                    }
                    ctx.stroke();                 
                } else {
                    
                }
                break;
        }
    });
    return;
}

function Toggle (num) {
    if(num == 1) {
        document.getElementById('DrawFractal').style.display = "block";
        document.getElementById("DrawTire").style.display = "none";
    }else if(num == 2) {
        document.getElementById('DrawFractal').style.display = "none";
        document.getElementById("DrawTire").style.display = "block";
    }
}

function getMousePosition(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return{
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function fractalize(ctx, ratio, iterations, toggleF, prevX, prevY, endX, endY) {
    /* 
        ***    Function has two routes:
        If this isn't the lowest iteration, calculate the number of lines needed for the next iteration down and find each line's start
        and endpoints. Then call this function for each of those lines.
        If this IS the lowest iteration, calculate the number of lines needed to fractalize, find their start and endpoints, then draw them and return.

        Higher Level Function: Makes an array object whose size is the calculated number of lines needed to draw.
                               Taking iteration into account, calculates the start and endpoint of every line that needs to be fractalized and
                               fills each entry in the array with the result.
                               In a while loop, calls the lower-level function and gives it each start and endpoint calculated along with the ratio.
    */

    var changeX = (endX - prevX) * (1 / ratio);
    var changeY = (endY - prevY) * (1 / ratio);
    var radians = Math.atan2(changeY, changeX);
    console.log(radians * (180/Math.PI));
    console.log(radians);
    if(toggleF == 0) {
        //30 degrees in radians
        var angleChange = (Math.PI/3);
    } else if(toggleF == 1) {
        //45 degrees in radians
        var angleChange = (Math.PI/2);
    }
    console.log(angleChange * (180/Math.PI));
    console.log(angleChange);
    //var radians = Math.atan(changeY/changeX);
    //var cos = parseInt((degrees * (Math.PI / 180)));
    var lineArray = new Array();
    var ellipseArray = new Array();
    var size = 0;
    //Get length of the hypotenuse
    var strLen = parseInt(Math.sqrt(Math.pow(changeX, 2) + Math.pow(changeY, 2)));
    //x = prevX + line-length * cosine of angle in radians
    var numOfLines = ratio * 2;
    var numOfEllipses = ratio;
    var newX, newY;
    if(toggleF == 0) {
        //This sets up a fractal line
        while(numOfLines != 0) {
            var nextX = prevX + changeX;
            var nextY = prevY + changeY;
            var totalChange = radians + angleChange;
            
            newX = parseInt(prevX + Math.cos(totalChange) * strLen);
            newY = parseInt(prevY + Math.sin(totalChange) * strLen);
            lineArray[size] = {x1: prevX, y1: prevY, x2: newX, y2: newY};
            size = size + 1;
            numOfLines = numOfLines - 1;
            prevX = newX;
            prevY = newY;

            //cos = (degrees * (Math.PI/180));
            newX = nextX
            newY = nextY
            lineArray[size] = {x1: prevX, y1: prevY, x2: newX, y2: newY};
            size = size + 1;
            numOfLines = numOfLines - 1;
            prevX = newX;
            prevY = newY;
            angleChange = -angleChange;
        }
    } else if(toggleF == 1) {
        //This sets up a fractal ellipse.
        //length = strlen. otherwise the angle drawn looks incorrect.
        //need to figure out how to find a point on an arc.
        //Ellipse Parametric Equation: All points on an ellipse conform to:
        //  x = h + (a cos t)
        //  y = k + (b sin t)
        // a is the radius of the x-axis, b of the y-axis
        // t is the radian of the angle from 0 to 2pi.
        // h and k being the (x, y) coordinates of the circle's center
        // Perform the equation found in the main function a number of times equal to the ratio * -1, with endAngle being startAngle + pi/ratio.
        //Obtain the x and y values of the ctx's current position to get x2 and y2.
        //use x2 and y2 to find the center of the circle, which is the point at the center of (x1, y1) and (x2, y2)
        //store xCenter, yCenter, radius, startAngle and endAngle into ellipseArray.
        //hold onto startX and startY at the beginning of the function and have ctx.moveTo() to move ctx to the correct startPoint,
        //then loop call arc() with the values in ellipseArray.
        //P.S. Have a bool variable that's value flips each time arc is called.
 //       var radius = strLen / 2;
 //       var nextX = ;
        var startX = prevX;
        var startY = prevY;
        
        var changeX = endX - prevX;
        var changeY = endY - prevY;
        var centerX = parseInt(prevX + (changeX/2));
        var centerY = parseInt(prevY + (changeY/2));

        var radius = parseInt(Math.sqrt(Math.pow(centerX - prevX, 2) + Math.pow(centerY - prevY, 2)));
        var startAngle = Math.atan2(prevY - centerY, prevX - centerX);
        var endAngle = Math.atan2(endY - centerY, endX - centerX);
        var endAngleIteration = (endAngle - startAngle) * (1/ratio);
        var endIncrease = 1;
        
        ctx.moveTo(startX, startY);
        var endNum = (startAngle) - (endAngleIteration * endIncrease);
        endIncrease++;
        while(numOfEllipses != 0) {
            //Insert a separate variable in here that keeps track of the centerX and centerY of each specific new arc and inserts THAT
            //instead of the center of the main arc.
            //ctx.beginPath();
            //ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            var x2 = (centerX + (Math.cos(endNum) * radius)) * 10000000 / 10000000;
            var y2 = (centerY + (Math.sin(endNum) * radius)) * 10000000 / 10000000;
            ellipseArray[size] = {x1: prevX, y1: prevY, x2: x2, y2: y2};
            size = size + 1;
            //startAngle = endAngle;
            endNum = (startAngle) - (endAngleIteration * endIncrease);
            endIncrease++;
            if(endNum == endAngle) {
                console.log("Worked!");
            }
            prevX = x2;
            prevY = y2;
            numOfEllipses--;
            //ctx.beginPath();
        }
        /*
        while(numOfEllipses != 0) {
            //Within this while loop, run arc in order to find the nextX and nextY locations for each ratio flip.
            //Then insert
            ellipseArray[size] = {xCenter: centerX, yCenter: centerY, radius: radius, startAngle: startAngle, endAngle: endAngle};
            size = size + 1;
        }
        */
    }
    
    if(iterations != 1) {
        var sizeP = 0;
        while(sizeP != size) {
            if(toggleF == 0) {
                fractalize(ctx, ratio, (iterations - 1), toggleF, lineArray[sizeP].x1, lineArray[sizeP].y1, lineArray[sizeP].x2, lineArray[sizeP].y2);
                sizeP++;
            } else if(toggleF == 1) {
                fractalize(ctx, ratio, (iterations - 1), toggleF, ellipseArray[sizeP].x1, ellipseArray[sizeP].y1, ellipseArray[sizeP].x2, ellipseArray[sizeP].y2);
                sizeP++;
            }
        }
    } else {
        var sizeP = 0;
        if(toggleF == 0) {
            while(sizeP != size) {
                ctx.moveTo(lineArray[sizeP].x1, lineArray[sizeP].y1);
                ctx.lineTo(lineArray[sizeP].x2, lineArray[sizeP].y2);
                sizeP++;
            }
            ctx.stroke();
            lineArray = null;
            size = 0;
        } else if(toggleF == 1) {
            var counter_clockwise = false;
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            while(sizeP != size) {
                var chX = ellipseArray[sizeP].x2 - ellipseArray[sizeP].x1;
                var chY = ellipseArray[sizeP].y2 - ellipseArray[sizeP].y1;
                var cX = parseInt(ellipseArray[sizeP].x1 + (chX/2));
                var cY = parseInt(ellipseArray[sizeP].y1 + (chY/2));

                var rad = parseInt(Math.sqrt(Math.pow(cX - ellipseArray[sizeP].x1, 2) + Math.pow(cY - ellipseArray[sizeP].y1, 2)));
                var sAngle = Math.atan2(ellipseArray[sizeP].y1 - cY, ellipseArray[sizeP].x1 - cX);
                var eAngle = Math.atan2(ellipseArray[sizeP].y2 - cY, ellipseArray[sizeP].x2 - cX);
                ctx.arc(cX, cY, rad, sAngle, eAngle, counter_clockwise);
                sizeP++;
                counter_clockwise = !counter_clockwise;
                ctx.stroke();
                /*
                ctx.arc(ellipseArray[sizeP].xCenter, ellipseArray[sizeP].yCenter, ellipseArray[sizeP].radius, ellipseArray[sizeP].startAngle, ellipseArray[sizeP].endAngle, clockwise);
                sizeP++;
                clockwise = !clockwise;
                */
            }
            ctx.stroke();
            ellipseArray = null;
            size = 0;
        }
    }
}