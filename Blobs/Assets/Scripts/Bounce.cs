using UnityEngine;
using System.Collections;

public class Bounce : MonoBehaviour
{
	private GameObject wrapperObject;
	private GameObject centerObject;
	float lobHeight = 10;
	float lobTime = 1.7f;
	public GameObject target;
	private Vector3 targetPosition;

	void Start() {
	}

//	void OnCollisionEnter(Collision collision) {
//		Debug.Log (collision.gameObject.name);
//		Bounceable parent = collision.gameObject.GetComponentInParent<JellyMeshReferencePoint> ().ParentJellyMesh
//			.GetComponentInParent<Bounceable> ();
//		centerObject = parent.centerObject;
//		wrapperObject = parent.wrapperObject;
//		targetPosition = target.transform.position;
//		bounce ();
//	}
	void OnTriggerEnter(Collider collider) {
		Debug.Log (collider.gameObject);
		Bounceable parent = collider.gameObject.GetComponentInParent<JellyMeshReferencePoint> ().ParentJellyMesh
			.GetComponentInParent<Bounceable> ();
		centerObject = parent.centerObject;
		wrapperObject = parent.wrapperObject;
		wrapperObject.transform.position = centerObject.transform.position;
		targetPosition = target.transform.position;
		bounce ();
	}
	void bounce(){
		//wrapperObject.rigidbody.useGravity = false;
		//wrapperObject.rigidbody.isKinematic = true;
		centerObject.rigidbody.useGravity = false;
		centerObject.rigidbody.isKinematic = true;
		iTween.MoveBy(centerObject, iTween.Hash("y", lobHeight, "time", lobTime/2, "easeType", iTween.EaseType.easeOutQuad));
		iTween.MoveBy(centerObject, iTween.Hash("y", -lobHeight, "time", lobTime/2, "delay", lobTime/2, "easeType", iTween.EaseType.easeInCubic));     
		iTween.MoveTo(wrapperObject, iTween.Hash("position", targetPosition, "time", lobTime, "easeType", iTween.EaseType.linear, "onComplete", "resetRigidBody", "onCompleteTarget", gameObject));
		//iTween.FadeTo(gameObject, iTween.Hash("delay", 3, "time", .5, "alpha", 0, "onComplete", "CleanUp"));
	}

	void resetRigidBody() {
		Debug.Log ("done");
		//wrapperObject.rigidbody.useGravity = true;
		//wrapperObject.rigidbody.isKinematic = false;
		centerObject.rigidbody.isKinematic = false;
		centerObject.rigidbody.useGravity = true;
	}

	void Update() {

	}

	// FIND PARENT WITH TAG
//	GameObject findParentWithTag(string tagToFind) {
//		return findParentWithTag(tagToFind, this.gameObject);
//	}
//	GameObject findParentWithTag(string tagToFind, GameObject child) {
//		GameObject parent = child.GetComponentInParent<>;
//		while (parent != null) { 
//			if (parent.tag == tagToFind) {
//				return parent.gameObject as GameObject;
//			}
//			parent = parent.transform.parent;
//		}
//		return null;
//	}
}