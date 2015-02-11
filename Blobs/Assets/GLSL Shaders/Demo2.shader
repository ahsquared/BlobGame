 
Shader "Andre/FastColor" {
        Properties {
                _MainTex ("Base (RGB)", 2D) = "white" {}
                _LC("LC", Color) = (1,0,0,0)
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
                        uniform vec4 _LC;
                       
                        void main()
                        {
                                 vec4 c;
                                 c.xyz = texture2D(_MainTex, TextureCoordinate).xyz * _LC.xyz;
                                 c.w = 1.0;
                                 gl_FragColor = c;
                        }
                       
                        #endif
                       
                        ENDGLSL
                }
        }
}