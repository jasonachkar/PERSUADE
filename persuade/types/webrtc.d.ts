interface RTCSessionDescriptionInit {
  sdp?: string;
  type: RTCSdpType;
}

type RTCSdpType = "answer" | "offer" | "pranswer" | "rollback";
