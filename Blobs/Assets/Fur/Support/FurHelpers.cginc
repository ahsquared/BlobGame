// Upgrade NOTE: replaced 'V2F_POS_FOG' with 'float4 pos : SV_POSITION'
// Upgrade NOTE: replaced 'glstate.matrix.mvp' with 'UNITY_MATRIX_MVP'

#ifndef FUR_HELPERS_INCLUDED
#define FUR_HELPERS_INCLUDED

#include "UnityCG.cginc"

struct v2f {
	float4 pos : SV_POSITION;
	float4 color : COLOR0;
	float4 uv : TEXCOORD0;
};

uniform float _FurLength;
uniform float _EdgeFade;
uniform float4 _LightDirection0;
uniform float4 _MyLightColor0;
uniform float4 _LightDirection1;
uniform float4 _MyLightColor1;

sampler2D _MainTex : register(s0);

void FurVertexPass(float multiplier, appdata_base v, float furLength, out float4 pos, out float fog, out float4 color, out float4 uv)
{
	// extrude position
	float4 wpos = v.vertex;
	wpos.xyz += v.normal * furLength * multiplier;
	pos = mul(UNITY_MATRIX_MVP, wpos);	

	// fog
	fog = pos.w;
	
	// UV (pass through to save instructions - loses tiling/offset though)
	uv = v.texcoord;
	
	// edge fade out
	float alpha = 1 - (multiplier * multiplier);
	
	float3 viewDir = normalize(ObjSpaceViewDir(v.vertex));
	
	alpha += dot(viewDir, v.normal) - _EdgeFade;
	
	// lighting
	float3 normalWorld = mul ((float3x3)_Object2World, v.normal);
	
	float light0 = clamp(dot(normalWorld, _LightDirection0.xyz), _MyLightColor0.w, 1);
	float light1 = clamp(dot(normalWorld, _LightDirection1.xyz), _MyLightColor1.w, 1);

	color = float4((light0 * _MyLightColor0).xyz + (light1 * _MyLightColor1).xyz,alpha);
}


v2f VertexProgram (appdata_base v)
{
	v2f o;
	FurVertexPass( FUR_MULTIPLIER, v, _FurLength, o.pos, o.fog, o.color, o.uv );
	return o;
}

#endif
