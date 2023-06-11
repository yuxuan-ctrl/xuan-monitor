/*
 * @Author: yuxuan-ctrl 
 * @Date: 2023-06-08 17:30:04
 * @LastEditors: yuxuan-ctrl 
 * @LastEditTime: 2023-06-08 17:33:28
 * @FilePath: \monitor-ui\src\components\Layout\components\Header\index.tsx
 * @Description: 
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
 */
import { Layout } from "antd";
// import AvatarIcon from "./components/AvatarIcon";
import CollapseIcon from "./components/CollapseIcon";
// import BreadcrumbNav from "./components/BreadcrumbNav";
// import AssemblySize from "./components/AssemblySize";
// import Language from "./components/Language";
// import Theme from "./components/Theme";
// import Fullscreen from "./components/Fullscreen";
import "./index.less";

const LayoutHeader = () => {
	const { Header } = Layout;

	return (
		<Header>
			<div className="header-lf">
				<CollapseIcon />
				{/* <BreadcrumbNav /> */}
			</div>
			<div className="header-ri">
				{/* <AssemblySize /> */}
				{/* <Language /> */}
				{/* <Theme /> */}
				{/* <Fullscreen /> */}
				<span className="username">Hooks</span>
				{/* <AvatarIcon /> */}
			</div>
		</Header>
	);
};

export default LayoutHeader;
