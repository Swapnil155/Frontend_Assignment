import api from './api'
import apiFormData from './apiFormData'
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const login = async (email, password, rememberMe) => {

    return api
        .post("/api/user/login", {
            email,
            password,
        })
        .then((response) => {
            console.log(rememberMe);
            if (response.status === 200) {
                // localStorage.setItem("user", JSON.stringify(response.data));
                if (rememberMe) {
                    // 24 * 3600 = 24 hours
                    // 86400 * 30 = 30 days
                    cookies.set('user', JSON.stringify(response.data.user), { path: '/', maxAge: 2592000 });
                } else {
                    cookies.set('user', JSON.stringify(response.data.user), { path: '/', maxAge: 24 * 3600 });
                }
                // console.log(cookies.get('user'));
            }
            return response;
        }).catch((error) => {
            console.log(error.response.data)
            return error.response
        })

}

const otpAuthentication = async (email, otp) => {

    return api.post('/api/user/otpVerified/', {
        email,
        otp
    }).then((response) => {
        console.log(response)
        return response
    }).catch((error) => {
        console.log(error.response.data)
        return error.response
    })
}

const resendOTP = async (email, id) => {
    console.log(email, id)

    return api.patch(`/api/user/resendOTP/${id}`, {
        email
    }).then((response) => {
        console.log(response)
        return response
    }).catch((error) => {
        console.log(error.response.data)
        return error.response
    })
}

const regiterUser = async (fullname, email, dob, location, password) => {
    return api.post(`api/user/`, {
        fullname,
        email,
        dob,
        location,
        password
    }).then((response) => {
        console.log(response)
        return response
    }).catch((error) => {
        console.log(error.response.data)
        return error.response
    })
}

const userBioOrLinks = async (id, Bio, linkedln, facebook) => {
    return api.patch(`/api/user/details/${id}`, {
        Bio,
        linkedln,
        facebook
    }).then((response) => {
        return response
    }).catch((error) => {
        return error.response
    })
}

const userUpdateProfileDetails = async (id, email, fullname, dob, location) => {

    return api.patch(`/api/user/update/${id}/personal-details`, {
        email, fullname, dob, location
    }).then((response) => {
        console.log(response)
        if (response.status === 200) {
            cookies.remove('user')
            cookies.set('user', JSON.stringify(response.data.user), { path: '/', maxAge: 24 * 3600 });
            console.log(cookies.get('user'))
        }
        return response
    }).catch((error) => {
        console.log(error.response)
        return error.response
    })
}

const userUpdatePassword = async (id, oldPassword, newPassword) => {

    return api.patch(`/api/user/update/${id}/change-password`, {
        oldPassword,
        newPassword
    }).then((response) => {
        if (response.status === 200) {
            cookies.remove('user')
            cookies.set('user', JSON.stringify(response.data.user), { path: '/', maxAge: 24 * 3600 });
            console.log(cookies.get('user'))
        }
        return response
    }).catch((error) => {
        console.log(error.response.data)
        return error.response
    })

}

const userDeleteAccount = async (id, reason) => {

    return api.patch(`/api/user/update/${id}/delete-account`, {
        reason
    }).then((response) => {
        if (response.status === 200) {
            cookies.remove('user')
        }
        return response
    }).catch((error) => {
        console.log(error.response.data)
        return error.response
    })

}

const userMediaGenderUpload = async (id, profileImage, video, gender) => {

    // console.log(id, profileImage[0], video[0], gender)

    const formData = new FormData()

    formData.append('profileImage', profileImage[0])
    formData.append('video', video[0])
    formData.append('gender', gender)

    console.log(formData)
    for (var pair of formData.entries()) {
        console.log(pair[0] + ', ' + JSON.stringify(pair[1]));
    }

    for (const value of formData.values()) {
        console.log(value);
    }

    return await apiFormData.put(`/api/user/media/${id}`, formData).then((response) => {
        console.log(response)
        if (response.status === 200) {
            return response
        }
        return response
    }).catch((error) => {
        console.log(error.response.data)
        return error.response
    })
}

const makePaymentUser = async (paymentMethodId, product, user_id) => {
    console.log(paymentMethodId, product, user_id)
    return api.post(`/api/payment/`, {
        paymentMethodId,
        product,
        user_id
    }).then((response) => {
        console.log(`Response : ${response}`)
        const { status } = response
        console.log(`Status : ${status}`)
        return response
    }).catch((error) => {
        console.log(`Error :`, error.response)
        return error.response
    })
}

const UpdatePaymentStatus = async (payment_id, user_id) => {
    console.log(payment_id, user_id)
    return api.post(`/api/payment/update/`, {
        payment_id,
        user_id
    }).then((response) => {
        console.log(`Response :`, response.data.user)
        const { status } = response
        console.log(`Status : ${status}`)
        if (status === 200) {
            cookies.set('user', JSON.stringify(response.data.user), { path: '/', maxAge: 24 * 3600 });
        }
        return response
    }).catch((error) => {
        console.log(`Error : ${error}`)
        return error.response
    })
}


const UserServices = {
    login,
    otpAuthentication,
    resendOTP,
    regiterUser,
    userBioOrLinks,
    userUpdateProfileDetails,
    userUpdatePassword,
    userDeleteAccount,
    userMediaGenderUpload,
    makePaymentUser,
    UpdatePaymentStatus
}

export default UserServices