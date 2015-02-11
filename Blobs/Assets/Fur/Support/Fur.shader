Shader "Fur"
{
	Properties
	{
		_FurLength ("Fur Length", Range (.0002, 1)) = .25
		_MainTex ("Base (RGB)", 2D) = "white" { }
		_Cutoff ("Alpha Cutoff", Range (0, 1)) = .0001
		_EdgeFade ("Edge Fade", Range(0,1)) = 0.4
		_LightDirection0 ("Light Direction 0, Ambient", Vector) = (1,0,0,1)
		_MyLightColor0 ("Light Color 0", Color) = (1,1,1,1)
		_LightDirection1 ("Light Direction 1, Ambient", Vector) = (1,0,0,1)
		_MyLightColor1 ("Light Color 1", Color) = (1,1,1,1)
	}
	Category
	{
		ZWrite Off
		Tags {"Queue" = "Transparent"}
		Blend SrcAlpha OneMinusSrcAlpha
		Alphatest Greater [_Cutoff]
		SubShader
		{
			Pass
			{
				ZWrite On
				Blend Off
				
				CGPROGRAM
				// vertex VertexProgram
				#define FUR_MULTIPLIER 0.0
				#include "FurHelpers.cginc"
				ENDCG
				SetTexture [_MainTex]
				{
					constantColor(1,1,1,1)
					combine texture * primary double, constant
				}
			}
			Pass
			{
				CGPROGRAM
				// vertex VertexProgram
				#define FUR_MULTIPLIER 0.05
				#include "FurHelpers.cginc"
				ENDCG
				SetTexture [_MainTex]
				{
					combine texture * primary double, texture * primary
				}
			}
			Pass
			{
				CGPROGRAM
				// vertex VertexProgram
				#define FUR_MULTIPLIER 0.1
				#include "FurHelpers.cginc"
				ENDCG
				SetTexture [_MainTex]
				{
					combine texture * primary double, texture * primary
				}
			}
			Pass
			{
				CGPROGRAM
				// vertex VertexProgram
				#define FUR_MULTIPLIER 0.15
				#include "FurHelpers.cginc"
				ENDCG
				SetTexture [_MainTex]
				{
					combine texture * primary double, texture * primary
				}
			}
			Pass
			{
				CGPROGRAM
				// vertex VertexProgram
				#define FUR_MULTIPLIER 0.2
				#include "FurHelpers.cginc"
				ENDCG
				SetTexture [_MainTex]
				{
					combine texture * primary double, texture * primary
				}
			}
			Pass
			{
				CGPROGRAM
				// vertex VertexProgram
				#define FUR_MULTIPLIER 0.25
				#include "FurHelpers.cginc"
				ENDCG
				SetTexture [_MainTex]
				{
					combine texture * primary double, texture * primary
				}
			}
			Pass
			{
				CGPROGRAM
				// vertex VertexProgram
				#define FUR_MULTIPLIER 0.3
				#include "FurHelpers.cginc"
				ENDCG
				SetTexture [_MainTex]
				{
					combine texture * primary double, texture * primary
				}
			}
			Pass
			{
				CGPROGRAM
				// vertex VertexProgram
				#define FUR_MULTIPLIER 0.35
				#include "FurHelpers.cginc"
				ENDCG
				SetTexture [_MainTex]
				{
					combine texture * primary double, texture * primary
				}
			}
			Pass
			{
				CGPROGRAM
				// vertex VertexProgram
				#define FUR_MULTIPLIER 0.4
				#include "FurHelpers.cginc"
				ENDCG
				SetTexture [_MainTex]
				{
					combine texture * primary double, texture * primary
				}
			}
			Pass
			{
				CGPROGRAM
				// vertex VertexProgram
				#define FUR_MULTIPLIER 0.45
				#include "FurHelpers.cginc"
				ENDCG
				SetTexture [_MainTex]
				{
					combine texture * primary double, texture * primary
				}
			}
			Pass
			{
				CGPROGRAM
				// vertex VertexProgram
				#define FUR_MULTIPLIER 0.5
				#include "FurHelpers.cginc"
				ENDCG
				SetTexture [_MainTex]
				{
					combine texture * primary double, texture * primary
				}
			}
			Pass
			{
				CGPROGRAM
				// vertex VertexProgram
				#define FUR_MULTIPLIER 0.55
				#include "FurHelpers.cginc"
				ENDCG
				SetTexture [_MainTex]
				{
					combine texture * primary double, texture * primary
				}
			}
			Pass
			{
				CGPROGRAM
				// vertex VertexProgram
				#define FUR_MULTIPLIER 0.6
				#include "FurHelpers.cginc"
				ENDCG
				SetTexture [_MainTex]
				{
					combine texture * primary double, texture * primary
				}
			}
			Pass
			{
				CGPROGRAM
				// vertex VertexProgram
				#define FUR_MULTIPLIER 0.65
				#include "FurHelpers.cginc"
				ENDCG
				SetTexture [_MainTex]
				{
					combine texture * primary double, texture * primary
				}
			}
			Pass
			{
				CGPROGRAM
				// vertex VertexProgram
				#define FUR_MULTIPLIER 0.7
				#include "FurHelpers.cginc"
				ENDCG
				SetTexture [_MainTex]
				{
					combine texture * primary double, texture * primary
				}
			}
			Pass
			{
				CGPROGRAM
				// vertex VertexProgram
				#define FUR_MULTIPLIER 0.75
				#include "FurHelpers.cginc"
				ENDCG
				SetTexture [_MainTex]
				{
					combine texture * primary double, texture * primary
				}
			}
			Pass
			{
				CGPROGRAM
				// vertex VertexProgram
				#define FUR_MULTIPLIER 0.8
				#include "FurHelpers.cginc"
				ENDCG
				SetTexture [_MainTex]
				{
					combine texture * primary double, texture * primary
				}
			}
			Pass
			{
				CGPROGRAM
				// vertex VertexProgram
				#define FUR_MULTIPLIER 0.85
				#include "FurHelpers.cginc"
				ENDCG
				SetTexture [_MainTex]
				{
					combine texture * primary double, texture * primary
				}
			}
			Pass
			{
				CGPROGRAM
				// vertex VertexProgram
				#define FUR_MULTIPLIER 0.9
				#include "FurHelpers.cginc"
				ENDCG
				SetTexture [_MainTex]
				{
					combine texture * primary double, texture * primary
				}
			}
			Pass
			{
				CGPROGRAM
				// vertex VertexProgram
				#define FUR_MULTIPLIER 0.95
				#include "FurHelpers.cginc"
				ENDCG
				SetTexture [_MainTex]
				{
					combine texture * primary double, texture * primary
				}
			}
		}
		Fallback " VertexLit", 1
	}
}
