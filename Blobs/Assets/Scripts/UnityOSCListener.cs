

using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using OSC.NET;

public class UnityOSCListener : MonoBehaviour  {
	//private GameObject madeCube;
	public Quaternion rotation;
	private static int numShapes = 6;
	public GameObject[] shapes = new GameObject[numShapes];
	public float radius = 4f;
	public float angle = Mathf.PI / 6; //30f;
	private bool init = false;
	public int shapeCounter = 0;

	Helpers helpers;

	public int sendport = 3343;
	private OSCTransmitter transmitter;
	private OSCMessage message;

	public bool[] availableTracks = new bool[] {true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true};

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
		string[] msgVals = address.Split ('|');
		string objectId = msgVals [msgVals.Length - 1];
		GameObject targetGameObject = GameObject.Find (objectId);
		bool objectExists = false; 
		if (targetGameObject != null) {
			objectExists = true;
		}
		Bounds bounds = new Bounds (Vector3.zero, new Vector3 (1, 2, 1));

		if (address.Contains ("rot") && init && objectExists) {
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
		if (address.Contains ("acc") && init && objectExists) {
			string[] accVals = address.Substring (4).Split ('|');
			if (accVals[0].IndexOf("null") == -1) {
				float valX = float.Parse( accVals [0] );
				float valY = float.Parse( accVals [1] );
				float valZ = float.Parse( accVals [2] );
				Vector3 v = new Vector3(valX, valY, valZ);
				string accId = accVals[3];
				//GameObject shapeToMove = GameObject.Find (accId);
				targetGameObject.GetComponent<move>().jump(v);
			}
		}
		if (address.Contains ("message") && !init) {
			string[] messageVals = address.Substring (8).Split ('|');
			Debug.Log(messageVals);
		}

		if (address.Contains ("create")) {

			if (shapeCounter == 16) {
				return;
			}
			string[] createVals = address.Substring (8).Split ('|');
			string id = createVals[2];
			//int shapesIndex = shapeCounter % numShapes;
			//Debug.Log ("index" + shapesIndex);
			GameObject newShape;
			Vector3 initPos = new Vector3(4.5f, 3f, 0f); //helpers.locationOnXYCircle(shapeCounter, radius, angle);
			//int shapeCount = shapeCounter % numShapes;
			//Debug.Log ("shapeCount: " + shapeCount);
			newShape = (GameObject) Instantiate(shapes[0], initPos, Quaternion.identity);
			newShape.name = id;
			move moveComponent = newShape.GetComponent<move>();
			MidiControl midicontrolComponent = newShape.GetComponent<MidiControl>();
			moveComponent.gameObjectId = id;
			//newShape.GetComponent<MidiControl>().controlNumber = shapeCounter + 1;
			int trackNumber = 0;
			for (int i = 0; i < availableTracks.Length; i++) {
				if (availableTracks[i]) {
					trackNumber = i + 1;
					availableTracks[i] = false;
					break;
				}
			}

			midicontrolComponent.trackNumber = trackNumber; //shapeCounter + 1;
			moveComponent.initPos = initPos;
			bounds.Encapsulate(newShape.transform.position);
			init = true;

			// let the client know their player number
			OSCMessage playerNumberMessage = new OSCMessage("playerNumber", shapeCounter + "|" + id);
			transmitter.Send(playerNumberMessage);
			shapeCounter++;
		}
		if (address.Contains ("color") && objectExists) {
			string[] colorVals = address.Substring (7).Split ('|');
			string[] rgb = colorVals[0].Split(',');
			Color shapeColor = new Color(float.Parse(rgb[0])/255f, float.Parse(rgb[1])/255f, float.Parse(rgb[2])/255f);
//			Debug.Log (address);
//			Debug.Log(rgb[0]);
//			Debug.Log(rgb[1]);
//			Debug.Log(rgb[2]);
//			Debug.Log(float.Parse(rgb[0])/255f);
//			Debug.Log(float.Parse(rgb[1])/255f);
//			Debug.Log(float.Parse(rgb[2])/255f);
			//string colorId = colorVals[1];
			//GameObject shapeToColor = GameObject.Find (colorId);
			targetGameObject.renderer.material.color = shapeColor;
		}
	}

}
