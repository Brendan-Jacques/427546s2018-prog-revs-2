Name: Brendan Jacques

Student ID: 01419198


Computer Graphics Assignment 2


Objective: To recreate the drawing interface described in the midterm, specifically to create a drawing interface that can create fractal lines/ellipses
and create tiles whose dimensions and polygonal nature are determined by an input score.

Degree of Success: 95%



Work Description: Was successfully able to implement an equation for scaling the dimensions of a circular tire based on the score provided by the user. 
Further created a program that creates a many-sided polygon with a number of sides equal to score by
finding a number of points on the circle equal to score that were evenly spaced apart, then drawing lines between each adjacent pair of points.

Developed programs for reproducing the fractal pattern displayed on the midterm for both line objects and ellipse objects whilst allowing
the user to choose the start and endpoints for the object created, the ratio of the object to be fractalized (in fractions), and the number of
iterations to fractalize.
Implemented simple sliders and selectors to allow the user to alter the line thickness and line color of any shape drawn.
Modified the interface from Assignment 1 to accomodate this assignment's features.

Was unable to solve some issues with the ellipse fractal drawer:
	1) The equation to calculate each arc of the fractal requires floating point addition, which due to js not being 100% accurate with such addition,
	leads to the fractal being somewhat jagged and imprecise.
	2) Unknown glitch that occurs when an ellipse produces 2 or more iterations that creates a circular pattern.

Note: Assignment Performance can vary depending on the number of iterations called for.

How to Run:

1) Project should be able to run simply by downloading the project file and running hw2.html as is.



Link to Weblab Page:  http://weblab.cs.uml.edu/~bjacques/427546s2018/prog-hws/2/hw2.html

Sources:

1) https://www.html5canvastutorials.com/advanced/html5-canvas-mouse-coordinates/ 

I took the getMousePos function used in this tutorial for use in calculating the mouse's position on the canvas. 


Other than the source above, this submission is entirely my own work.