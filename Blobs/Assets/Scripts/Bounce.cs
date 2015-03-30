using UnityEngine;
using System.Collections;

public class Bounce : MonoBehaviour
{
	private JellyMesh parent;
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
		parent = collider.gameObject.GetComponent<JellyMeshReferencePoint> ().ParentJellyMesh.GetComponent<JellyMesh>();
//		centerObject = parent.centerObject;
//		wrapperObject = parent.wrapperObject;
//		centerObject.rigidbody.useGravity = false;
//		centerObject.rigidbody.isKinematic = true;
//		targetPosition = target.transform.position;
		collider.gameObject.GetComponent<JellyMeshReferencePoint> ().ParentJellyMesh.GetComponent<move>().changePart ();
		bounce ();
	}

	void bounce() {
		// use addForce
//		Debug.Log("bounce");
		float directionX = Random.value > 0.5 ? 1.0f : -1.0f;
		float directionY = Random.value > 0.5 ? 1.0f : -1.0f;
		parent.AddForce(new Vector3(Random.Range (0.5f, 1f) * 5000.0f * directionX, 10000.0f, Random.Range (0.5f, 1f) * 5000.0f * directionY), true);
	}

	void bounceTween(){ 
		iTween.MoveBy(centerObject, iTween.Hash("y", lobHeight, "time", lobTime/2, "easeType", iTween.EaseType.easeOutQuad));
		iTween.MoveBy(centerObject, iTween.Hash("y", -lobHeight, "time", lobTime/2, "delay", lobTime/2, "easeType", iTween.EaseType.easeInCubic));     
		iTween.MoveTo(wrapperObject, iTween.Hash("position", targetPosition, "time", lobTime, "easeType", iTween.EaseType.linear, "onComplete", "resetRigidBody", "onCompleteTarget", gameObject));
		//iTween.FadeTo(gameObject, iTween.Hash("delay", 3, "time", .5, "alpha", 0, "onComplete", "CleanUp"));
	}

	void resetRigidBody() {
		Debug.Log ("done");
		//centerObject.rigidbody.isKinematic = false;
		//centerObject.rigidbody.useGravity = true;
//		centerObject.rigidbody.velocity = Vector3.zero;
//		centerObject.rigidbody.angularVelocity = Vector3.zero;
//		centerObject.transform.position = new Vector3 (0, 0, 0);
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