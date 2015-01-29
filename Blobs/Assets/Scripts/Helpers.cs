using UnityEngine;
using System.Collections;

public class Helpers : MonoBehaviour {

	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
	
	}

	public Vector3 locationOnXYCircle(int counter, float radius, float angle) {
		return new Vector3(Mathf.Cos(counter * angle) * radius, Mathf.Sin(counter * angle) * radius, 0);
	}

	public Vector3 locationOnXZCircle(int counter, float radius, float angle) {
		//Debug.Log (counter + ", " + radius + ", " + angle);
		//Debug.Log ("Sin: " + Mathf.Sin(counter * angle) * radius);
		//Debug.Log ("Cos: " + Mathf.Cos (counter * angle) * radius);
		return new Vector3(Mathf.Sin(counter * angle) * radius, 0, Mathf.Cos(counter * angle) * radius);
	}
	public Vector3 locationOnZYCircle(int counter, float radius, float angle) {
		//Debug.Log (counter + ", " + radius + ", " + angle);
		//Debug.Log ("Sin: " + Mathf.Sin(counter * angle) * radius);
		//Debug.Log ("Cos: " + Mathf.Cos (counter * angle) * radius);
		return new Vector3(0, Mathf.Sin(counter * angle) * radius, Mathf.Cos(counter * angle) * radius);
	}
}
