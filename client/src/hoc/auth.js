import axios from 'axios';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { auth } from "../actions/user_action";

export default function (SpecificComponent, option, adminRoute = null) {

    // SpecificComponent: 랜딩페이지 컴포넌트
    // option: null => 아무나 출입가능한페이지, true => 로그인한 유저만 출입이 가능한 페이지, false => 로그인한 유저는 출입불가한 페이지
    function AuthenticationCheck(props) {

        const dispatch = useDispatch();

        useEffect(() => {
            
            dispatch(auth())
            .then(res => {
                // 로그인 하지 않은 상태
                if(!res.payload.isAuth) {
                    if(option) {
                        props.history.push('/login')
                    }
                } else {
                    // 로그인한 상태
                    if(adminRoute && !res.payload.isAdmin) {
                        props.history.push('/')
                    } else {
                        if(option === false)
                        props.history.push('/')
                    }
                }
            })
        }, [])

        return (
            <SpecificComponent />
        )
    }
    return AuthenticationCheck
}