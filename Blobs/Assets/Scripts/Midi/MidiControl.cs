using UnityEngine;
using System.Collections;

public class MidiControl : MonoBehaviour
{
	public MidiChannel channel = MidiChannel.Ch1;
	public int noteNumber = 48;
	public int controlNumber = 1;
	public float velocity = 0.9f;
	public float delay = 0.0f;
	public float length = 0.1f;
	public float interval = 1.0f;
	[Range(0f,1f)]
	public float ccScale = 0.08f;
	//private float highestVal = 0f;

	private float currentVal = 0f;
	private float kFilteringFactor = 0.1f;

	float scale;
	
	IEnumerator Start ()
	{
		MidiBridge.instance.Warmup();
		
		if (delay > 0.0f) {
			yield return new WaitForSeconds (delay);
		}

	}
	
		
	public void sendCC(float val) {
		float adjustedVal = Mathf.Min (1, val * ccScale);
		currentVal = (adjustedVal * kFilteringFactor) + (currentVal * (1.0f - kFilteringFactor));
		MidiOut.SendControlChange (channel, controlNumber, currentVal);
		//highestVal = Mathf.Max (val, highestVal);
		//Debug.Log ("CC Val: " + val + ", Highest: " + currentVal);
	}
	
	void Update ()
	{
		//scale = 1.0f - (1.0f - scale) * Mathf.Exp (Time.deltaTime * -4.0f);
		//transform.localScale = Vector3.one * scale;
	}
}
