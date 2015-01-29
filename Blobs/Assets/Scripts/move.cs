using UnityEngine;
using System.Collections;

public class move : MonoBehaviour {
	public Vector3 initPos;
	private bool moving = false;
	private float time;
	public float vectorScale = 2.5f;

	[Range(0f,1f)]
	public float sizeScaleFactor = 0.3f;
	private float currentSize = 0f;
	private float kFilteringFactor = 0.1f;

	public float timeToLive = 1f;
	public float timeSinceDisconnected = 0f;

	// Use this for initialization
	void Start () {
//		iTween.ScaleBy (gameObject, iTween.Hash ("amount", new Vector3(2f, 2f, 2f), 
//		                                         "time", .5f, 
//		                                         "easetype", iTween.EaseType.easeInQuint,
//		                                         "looptype", iTween.LoopType.pingPong));
	}
	
	// Update is called once per frame
	void LateUpdate () {
		timeSinceDisconnected += Time.deltaTime;
		if (timeSinceDisconnected > timeToLive) {
			Debug.Log ("go away");
			GameObject receiver = GameObject.Find ("OSCReceiver");
			receiver.GetComponent<UnityOSCListener>().shapeCounter--;
			Destroy(gameObject);
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
	void ResetMoving() {
		moving = false;
		//Debug.Log ("resetFlag: " + moving);
	}
}
