/*
 * @Author: yuxuan-ctrl
 * @Date: 2024-02-26 16:15:36
 * @LastEditors: yuxuan-ctrl
 * @LastEditTime: 2024-02-26 17:18:02
 * @FilePath: \monitor-ui-2\src\pages\Errors\details\style.style.ts
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
import { createStyles } from 'antd-style';

const useStyles = createStyles(({ token }) => {
  return {
    title: {
      marginBottom: '16px',
      color: token.colorTextHeading,
      fontWeight: '500',
      fontSize: '16px',
    },
    player: {
      width: '100%',
    },
  };
});

export default useStyles;
