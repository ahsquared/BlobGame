using UnityEngine;
using System.Collections;

public class Bounceable : MonoBehaviour {

	public GameObject centerObject;
	public GameObject wrapperObject;

	// Use this for initialization
	void Start () {
		centerObject = gameObject.GetComponentInChildren<JellyMeshReferencePoint> ().gameObject;
	}
	
	// Update is called once per frame
	void Update () {
	
	}
	
}
