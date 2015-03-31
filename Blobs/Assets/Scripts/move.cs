using UnityEngine;
using System.Collections;

using OSC.NET;

public class move : MonoBehaviour {
	public Vector3 initPos;
	private bool moving = false;
	private float time;
	public float vectorScale = 2.5f;

	[Range(0, 127)]
	public int noteNumber;

	[Range(0f,1f)]
	public float sizeScaleFactor = 0.3f;
	private float currentSize = 0f;
	private float kFilteringFactor = 0.1f;

	public float timeToLive = 1f;
	public float timeSinceDisconnected = 0f;

	public float m_MinJumpForce = 10.0f;
	public float m_MaxJumpForce = 40.0f;
	
	public float m_MinTorqueForce = 10.0f;
	public float m_MaxTorqueForce = 10.0f;
	
	public Vector3 m_MinJumpVector = new Vector3(-0.1f, 1.0f, 0.0f);
	public Vector3 m_MaxJumpVector = new Vector3(0.1f, 4.0f, 0.0f);
	public Vector3 m_MinTorqueVector = new Vector3(-0.1f, -0.1f, -0.1f);
	public Vector3 m_MaxTorqueVector = new Vector3(0.1f, 0.1f, 0.1f);
	public bool m_CentralPointOnly = false;

	public float scaleFactor = 1f;
	public float minAccelForLaunch = 20f;

	// to check that collision is caused by a new jump
	// not multiple colliders in jelly mesh
	public bool jumped = true;

	private int[] notes = { 60, 62, 64, 65, 67, 69, 71, 72 };

	private GameObject centerObject;

	// in c vars
	private bool inCMode = true;
	public int partCounter = 0;
	private int numberOfParts = 53;

	// artpop vars
	private bool artpop = true;
	public float timeBetweenJumps = 1f;
	public float timeSinceJumped = 0f;

	public string gameObjectId;

	/**
	 * send OSC messages back to the phone
	 */
	private OSCTransmitter oscTransmitter;

	// Use this for initialization
	IEnumerator Start () {
		yield return new WaitForSeconds (1f);
		oscTransmitter = new OSCTransmitter ("localhost", 3333);
		changePart ();
		timeSinceJumped = 0;
	}

//	void OnJellyCollisionEnter(JellyMesh.JellyCollision collision) {
//		// Debug.Log ("magnitude: " + collision.Collision.relativeVelocity.magnitude);
//		if (!inCMode) {
//			int note = notes [Random.Range (0, 7)];
//			StartCoroutine (GetComponent<MidiControl> ().sendNote (note, 100f));
//		} else {
//			if (jumped) {
//				//StartCoroutine (GetComponent<MidiControl> ().sendNote (partCounter, 100f));
//				GetComponent<MidiControl> ().sendClipLaunch (partCounter);
//				// send messages to player
//				OSCMessage message = new OSCMessage ("bounce");
//				oscTransmitter.Send (message);
//				OSCMessage message2 = new OSCMessage("partNumber", partCounter % 9);
//				oscTransmitter.Send(message2);
//				// reset jump flag
//				jumped = false;
//				// check if need to increment part
//				if (partRepeatCount < partRepeatMin) {
//					partRepeatCount++;
//				} else {
//					partCounter++;
//					partRepeatCount = 0;
//					//partRepeatMin = Random.Range (repeatMin, repeatMax);
//				}
//			}
//		}
//	}

	public void changePart() {
		//StartCoroutine (GetComponent<MidiControl> ().sendNote (partCounter, 100f));
		int part = partCounter % numberOfParts;
		GetComponent<MidiControl> ().sendClipLaunch (part);
		// send messages to player
		OSCMessage message = new OSCMessage ("bounce", gameObjectId);
		oscTransmitter.Send (message);
		OSCMessage message2 = new OSCMessage("partNumber", part + "|" + gameObjectId);
		Debug.Log ("partNumber: " + part); 
		oscTransmitter.Send(message2);
		// reset jump flag
		jumped = false;
		// increment part
		partCounter++;
	}

	// Update is called once per frame
	void LateUpdate () {
		timeSinceJumped += Time.deltaTime;

		timeSinceDisconnected += Time.deltaTime;
		if (timeSinceDisconnected > timeToLive) {
			Debug.Log ("go away");
			GameObject receiver = GameObject.Find ("OSCReceiver");
			receiver.GetComponent<UnityOSCListener> ().shapeCounter--;
			GetComponent<MidiControl> ().sendClipStop ();
			int trackNumber = GetComponent<MidiControl>().trackNumber;
			receiver.GetComponent<UnityOSCListener> ().availableTracks[trackNumber - 1] = true;
			Destroy (gameObject);
		}
	}

	public void resetTimeLeft() {
		//timeSinceDisconnected = 0f;
	}

	public void scaleShape(float size) {
		float adjustedSize = Mathf.Max (1, size * sizeScaleFactor);
		currentSize = (adjustedSize * kFilteringFactor) + (currentSize * (1.0f - kFilteringFactor));
		//Debug.Log(size + " - " + sizeScaleFactor + " - " + adjustedSize + " - " + currentSize);
		gameObject.transform.localScale = new Vector3(currentSize, currentSize, currentSize);
		//gameObject.transform.GetComponentInChildren<Light>().light.range = 2.5f * currentSize;
	}

	public void jump(Vector3 v) {
		JellyMesh m_JellyMesh = GetComponent<JellyMesh> ();
		if (m_JellyMesh) {
			Vector3 force = new Vector3(v.z, -v.y, v.x);
			if ( ( Mathf.Abs(v.x) + Mathf.Abs(v.y) + Mathf.Abs (v.z) ) > minAccelForLaunch) {
				jumped = true;
				Vector3 torqueVector = Vector3.zero;
				torqueVector.x = UnityEngine.Random.Range(m_MinTorqueVector.x, m_MaxTorqueVector.x);
				torqueVector.y = UnityEngine.Random.Range(m_MinTorqueVector.y, m_MaxTorqueVector.y);
				torqueVector.z = UnityEngine.Random.Range(m_MinTorqueVector.z, m_MaxTorqueVector.z);
				torqueVector.Normalize();

				force = force * scaleFactor;
//				Debug.Log (force);
				m_JellyMesh.AddForce(force, m_CentralPointOnly);
				m_JellyMesh.AddTorque(torqueVector * UnityEngine.Random.Range(m_MinTorqueForce, m_MaxTorqueForce), false);

				if (artpop && timeSinceJumped > timeBetweenJumps) {
					changePart();
					timeSinceJumped = 0f;
				}
				timeSinceDisconnected = 0f;
			}
			//					shapeToScale.GetComponent<MidiControl>().sendCC(v.sqrMagnitude);
			// not sure about the halo look
			//cubeToScale.transform.GetComponentInChildren<Light>().light.range = 3 * (x + y + z);
		}
	}
//	public void jump(Vector3 v) {
//		if (gameObject) {
//			Vector3 force = new Vector3(v.z, -v.y, v.x);
//			if ( ( Mathf.Abs(v.x) + Mathf.Abs(v.y) + Mathf.Abs (v.z) ) > minAccelForLaunch) {
//				Vector3 torqueVector = Vector3.zero;
//				torqueVector.x = UnityEngine.Random.Range(m_MinTorqueVector.x, m_MaxTorqueVector.x);
//				torqueVector.y = UnityEngine.Random.Range(m_MinTorqueVector.y, m_MaxTorqueVector.y);
//				torqueVector.z = UnityEngine.Random.Range(m_MinTorqueVector.z, m_MaxTorqueVector.z);
//				torqueVector.Normalize();
//
//				force = force * scaleFactor;
//				Debug.Log (force);
//				GameObject centerObject = gameObject.GetComponentInChildren<JellyMeshReferencePoint> ().gameObject;
//				force.Normalize();
//				float lobHeight = force.y * 5;
//				float lobTime = 1f;
//				Vector3 amountXZ = new Vector3(force.x, 0, force.z) * 5;
//				//gameObject.GetComponentInChildren<JellyMesh>().AddForce(force, m_CentralPointOnly);
//				//gameObject.GetComponentInChildren<JellyMesh>().AddTorque(torqueVector * UnityEngine.Random.Range(m_MinTorqueForce, m_MaxTorqueForce), false);
//
//				centerObject.rigidbody.isKinematic = true;
//
//				iTween.MoveBy(centerObject, iTween.Hash("y", lobHeight, "time", lobTime/2, "easeType", iTween.EaseType.easeOutQuad));
//				iTween.MoveBy(centerObject, iTween.Hash("y", -lobHeight, "time", lobTime/2, "delay", lobTime/2, "easeType", iTween.EaseType.easeInCubic));     
//				iTween.MoveBy(gameObject, iTween.Hash("amount", amountXZ, "time", lobTime, "easeType", iTween.EaseType.linear, "onComplete", "resetKinematic", "onCompleteTarget", gameObject));
//				timeSinceDisconnected = 0f;
//			}
//		}
//	}
	public void Fling (Vector3 v) {
		if (!moving) {
			moving = true;
			float vMag = v.sqrMagnitude;
			Vector3 vAmt = v * vectorScale;
			time = Mathf.Min (1, vMag * .1f);
			//Debug.Log("setFlag: " + moving);
			iTween.MoveBy (gameObject, iTween.Hash ("amount", vAmt, "time", time, "oncomplete", "FlingBack", "easetype", iTween.EaseType.easeInOutQuad));
			//Debug.Log("moveBy: " + v);

		}
	}
	void FlingBack() {
		iTween.MoveTo (gameObject, iTween.Hash ("position", initPos, "time", time, "oncomplete", "ResetMoving", "easetype", iTween.EaseType.easeOutBounce));
		//Debug.Log ("moveTo: " + initPos);
	}

	void resetKinematic() {
		//centerObject.rigidbody.isKinematic = false;
	}

	void ResetMoving() {
		moving = false;
		//Debug.Log ("resetFlag: " + moving);
	}
}
