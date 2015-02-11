Shader "Andre/Demo" {
    Properties {
        _MainTex ("Base (RGB)", 2D) = "white" {}
    }
   
    SubShader {
        Tags { "Queue" = "Geometry" }
       
        Pass {
            GLSLPROGRAM
           
            #ifdef VERTEX
           
            varying vec2 TextureCoordinate;
           
            void main()
            {
                gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
                TextureCoordinate = gl_MultiTexCoord0.xy;
            }
           
            #endif
           
            #ifdef FRAGMENT
                       
            uniform sampler2D _MainTex;
            varying vec2 TextureCoordinate;
           
            void main()
            {
                gl_FragColor = texture2D(_MainTex, TextureCoordinate);
            }
           
            #endif
           
            ENDGLSL
        }
    }
}
 
