#version 300 es

in vec4 a_VertexPosition;
in vec4 a_ColorPostion;

out vec4 v_color;

void main(){ // hier wel puntkomma's
    gl_Position = a_VertexPosition;
    gl_PointSize = 10.0;
    v_color = a_VertexColor;
}