import { Navigate, NavigateFunction } from "react-router-dom";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { MessageResponse } from "../types/api-types";
import { SerializedError } from "@reduxjs/toolkit";

type ResType =
	| {
			data: MessageResponse;
			error?: undefined;
	  }
	| {
			data?: undefined;
			error: FetchBaseQueryError | SerializedError;
	  };

export const responseToast = (res: ResType, navigate: NavigateFunction) => {};
