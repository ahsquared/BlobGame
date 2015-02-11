Shader "Andre/Fur3" {
    Properties {
        _MainTex ("Base (RGB)", 2D) = "white" {}
        _GrassMask ("Mask", 2D) = "white" {}
    }
    SubShader {
        Tags { "RenderType"="Transparent" }
        LOD 600
       
        CGINCLUDE
            #include "UnityCG.cginc"
            #pragma target 3.0
           
            struct v2f {
                float4 pos : SV_POSITION;
                half2 uv0 : TEXCOORD0;
                half2 uv1 : TEXCOORD1;
            };
           
            uniform sampler2D _MainTex, _GrassMask;
            float4 _MainTex_ST;
 
            half4 frag (v2f i) : COLOR {
                half4 col = tex2D(_MainTex, i.uv0);
                half4 mask = tex2D(_GrassMask, i.uv1);
                return float4(col.rgb, mask);
            }
        ENDCG
       
        Pass {
            Blend SrcColor OneMinusSrcColor
            AlphaTest Greater 0.9
            CGPROGRAM
                #pragma vertex vert
                #pragma fragment frag
               
                v2f vert(appdata_base v) {
                    v2f o;
                    float4 p = v.vertex;
                    p.y += .01;
                    p.x += sin(_Time.y + p.x * 0.1) * 0.01;
                    p.z += cos(_Time.y + p.z * 0.1) * 0.01;
                    o.pos = mul(UNITY_MATRIX_MVP, p);
                    o.uv0 = TRANSFORM_TEX(v.texcoord, _MainTex);
                    o.uv1 = v.texcoord;
                    return o;
                }
            ENDCG
        }
        Pass {
            Blend SrcColor OneMinusSrcColor
            //Blend SrcAlpha OneMinusSrcAlpha
            AlphaTest Greater 0.9
            CGPROGRAM
                #pragma vertex vert
                #pragma fragment frag
               
                v2f vert(appdata_base v) {
                    v2f o;
                    float4 p = v.vertex;
                    p.y += .02;
                    p.x += sin(_Time.y + p.x * 0.1) * 0.02;
                    p.z += cos(_Time.y + p.z * 0.1) * 0.02;
                    o.pos = mul(UNITY_MATRIX_MVP, p);
                    o.uv0 = TRANSFORM_TEX(v.texcoord, _MainTex);
                    o.uv1 = v.texcoord;
                    return o;
                }
            ENDCG
        }
        Pass {
            Blend SrcColor OneMinusSrcColor
            //Blend SrcAlpha OneMinusSrcAlpha
            AlphaTest Greater 0.9
            CGPROGRAM
                #pragma vertex vert
                #pragma fragment frag
               
                v2f vert(appdata_base v) {
                    v2f o;
                    float4 p = v.vertex;
                    p.y += .03;
                    p.x += sin(_Time.y + p.x * 0.1) * 0.03;
                    p.z += cos(_Time.y + p.z * 0.1) * 0.03;
                    o.pos = mul(UNITY_MATRIX_MVP, p);
                    o.uv0 = TRANSFORM_TEX(v.texcoord, _MainTex);
                    o.uv1 = v.texcoord;
                    return o;
                }
            ENDCG
        }
        Pass {
            Blend SrcColor OneMinusSrcColor
            //Blend SrcAlpha OneMinusSrcAlpha
            AlphaTest Greater 0.9
            CGPROGRAM
                #pragma vertex vert
                #pragma fragment frag
               
                v2f vert(appdata_base v) {
                    v2f o;
                    float4 p = v.vertex;
                    p.y += .04;
                    p.x += sin(_Time.y + p.x * 0.1) * 0.04;
                    p.z += cos(_Time.y + p.z * 0.1) * 0.04;
                    o.pos = mul(UNITY_MATRIX_MVP, p);
                    o.uv0 = TRANSFORM_TEX(v.texcoord, _MainTex);
                    o.uv1 = v.texcoord;
                    return o;
                }
            ENDCG
        }
        Pass {
            Blend SrcColor OneMinusSrcColor
            //Blend SrcAlpha OneMinusSrcAlpha
            AlphaTest Greater 0.9
            CGPROGRAM
                #pragma vertex vert
                #pragma fragment frag
               
                v2f vert(appdata_base v) {
                    v2f o;
                    float4 p = v.vertex;
                    p.y += .05;
                    p.x += sin(_Time.y + p.x * 0.1) * 0.05;
                    p.z += cos(_Time.y + p.z * 0.1) * 0.05;
                    o.pos = mul(UNITY_MATRIX_MVP, p);
                    o.uv0 = TRANSFORM_TEX(v.texcoord, _MainTex);
                    o.uv1 = v.texcoord;
                    return o;
                }
            ENDCG
        }
        Pass {
            Blend SrcColor OneMinusSrcColor
            //Blend SrcAlpha OneMinusSrcAlpha
            AlphaTest Greater 0.9
            CGPROGRAM
                #pragma vertex vert
                #pragma fragment frag
               
                v2f vert(appdata_base v) {
                    v2f o;
                    float4 p = v.vertex;
                    p.y += .06;
                    p.x += sin(_Time.y + p.x * 0.1) * 0.06;
                    p.z += cos(_Time.y + p.z * 0.1) * 0.06;
                    o.pos = mul(UNITY_MATRIX_MVP, p);
                    o.uv0 = TRANSFORM_TEX(v.texcoord, _MainTex);
                    o.uv1 = v.texcoord;
                    return o;
                }
            ENDCG
        }
        Pass {
            Blend SrcColor OneMinusSrcColor
            //Blend SrcAlpha OneMinusSrcAlpha
            AlphaTest Greater 0.9
            CGPROGRAM
                #pragma vertex vert
                #pragma fragment frag
               
                v2f vert(appdata_base v) {
                    v2f o;
                    float4 p = v.vertex;
                    p.y += .07;
                    p.x += sin(_Time.y + p.x * 0.1) * 0.07;
                    p.z += cos(_Time.y + p.z * 0.1) * 0.07;
                    o.pos = mul(UNITY_MATRIX_MVP, p);
                    o.uv0 = TRANSFORM_TEX(v.texcoord, _MainTex);
                    o.uv1 = v.texcoord;
                    return o;
                }
            ENDCG
        }
    }
}