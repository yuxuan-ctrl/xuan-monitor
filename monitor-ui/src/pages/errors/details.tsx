/*
 * @Author: yuxuan-ctrl 
 * @Date: 2024-02-20 15:00:52
 * @LastEditors: yuxuan-ctrl 
 * @LastEditTime: 2024-02-21 16:20:37
 * @FilePath: \monitor-ui\src\pages\errors\details.tsx
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
 */
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
