import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import Record from "@/utils";
import {Button} from "antd";

const ErrorDetails = () => {
  const {id} = useParams<{id: string}>();
  const [errorDetail, setErrorDetail] = useState<defs.ErrorInfoDto>({});
  useEffect(() => {
    API.errors.getDetails.request({id}).then((res) => {
      setErrorDetail(res.data);
    });
  }, []);
  const replay = () => {
    new Record().replay(document.getElementById("player"), errorDetail.record);
  };

  return (
    <>
      <Button onClick={replay}>播放回放</Button>
      <div id="player"></div>
    </>
  );
};

export default ErrorDetails;
