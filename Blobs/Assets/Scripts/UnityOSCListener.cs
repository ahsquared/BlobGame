

using UnityEngine;
using System.Collections;
using System.Collections.Generic;

using OSC.NET;

public class UnityOSCListener : MonoBehaviour  {
	//private GameObject madeCube;
	public Quaternion rotation;
	private static int numShapes = 6;
	public GameObject[] shapes = new GameObject[numShapes];
	public float radius = 4f;
	public float angle = Mathf.PI / 6; //30f;
	private bool init = false;
	public int shapeCounter = -1;

	Helpers helpers;

	public int sendport = 3343;
	private OSCTransmitter transmitter;
	private OSCMessage message;

	void Start() {
		helpers = GameObject.Find("Helpers").GetComponent<Helpers>();
		numShapes = shapes.Length;
		//Debug.Log (shapes[1]);

		message = new OSCMessage("/shape", "1");
		transmitter = new OSCTransmitter("127.0.0.1", sendport);
		transmitter.Send(message);

	}
	public void OSCMessageReceived(OSC.NET.OSCMessage message){	
		string address = message.Address;
		//ArrayList args = message.Values;
		Bounds bounds = new Bounds (Vector3.zero, new Vector3 (1, 2, 1));

		if (address.Contains ("rot") && init) {
			//Debug.Log (address);
//			string[] rotVals = address.Substring (4).Split ('|');
//			if (rotVals[0].IndexOf("null") == -1) {
//				float alpha = float.Parse (rotVals [0]);
//				float beta = float.Parse (rotVals [1]);
//				float gamma = float.Parse (rotVals [2]);
//				string rotId = rotVals[3];
//				rotation = Quaternion.Euler (beta, gamma, alpha);
//				//rotation = new Quaternion (x, y, z, w);
//				GameObject shapeToRotate = GameObject.Find (rotId);
//				//hand.transform.Translate (x/factor, y/factor, z/factor, null);
//				if (shapeToRotate) {
//					Debug.Log (rotation);
//					shapeToRotate.transform.rotation = rotation;
//				}
//			}
		}
		if (address.Contains ("acc") && init) {
			string[] accVals = address.Substring (4).Split ('|');
			if (accVals[0].IndexOf("null") == -1) {
				float valX = float.Parse( accVals [0] );
				float valY = float.Parse( accVals [1] );
				float valZ = float.Parse( accVals [2] );
				Vector3 v = new Vector3(valX, valY, valZ);
				string accId = accVals[3];
				GameObject shapeToMove = GameObject.Find (accId);
				shapeToMove.GetComponent<move>().jump(v);
			}
		}
		if (address.Contains ("message") && !init) {
			string[] messageVals = address.Substring (8).Split ('|');
			Debug.Log(messageVals);
		}

		if (address.Contains ("create")) {
			shapeCounter++;
			if (shapeCounter == 8) {
				return;
			}
			string[] createVals = address.Substring (8).Split ('|');
			//Debug.Log (createVals[0] + " -- " + createVals[1] + " -- " + createVals[2]);
			string[] hsl = createVals[1].Split(',');
			HSLColor hslColor = new HSLColor(float.Parse(hsl[0]), float.Parse(hsl[1]), float.Parse(hsl[2]));
			//Color shapeColor = hslColor.ToRGBA();
			string[] rgb = createVals[1].Split(',');
			Color shapeColor = new Color(float.Parse(rgb[0])/255f, float.Parse(rgb[1])/255f, float.Parse(rgb[2])/255f);
			//Debug.Log(shapeColor);
			string id = createVals[2];
			int shapesIndex = shapeCounter % numShapes;
			//Debug.Log ("index" + shapesIndex);
			GameObject newShape;
			Vector3 initPos = helpers.locationOnXYCircle(shapeCounter, radius, angle);
			int shapeCount = shapeCounter % numShapes;
			//Debug.Log ("shapeCount: " + shapeCount);
			newShape = (GameObject) Instantiate(shapes[shapeCount], initPos, Quaternion.identity);
			newShape.name = id;
			newShape.GetComponent<MidiControl>().controlNumber = shapeCounter + 1;
			newShape.GetComponent<move>().initPos = initPos;
//			Renderer[] shapeRenderers = newShape.GetComponentsInChildren<Renderer>();
//			foreach(Renderer renderer in shapeRenderers) {
//				renderer.material.SetColor("_Color", shapeColor);
//				renderer.material.SetColor("_SpecColor", shapeColor);
//			};
//			Transform trail = newShape.transform.Find("Trail");
//			trail.renderer.material.SetColor("_TintColor", shapeColor);
			bounds.Encapsulate(newShape.transform.position);
			init = true;

//			message = new OSCMessage("/shape", "1");
//			transmitter = new OSCTransmitter("10.0.0.2", sendport);
//			transmitter.Send(message);
		}
	}

}
