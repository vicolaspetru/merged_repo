/**
 * WordPress dependencies
 */
import { Component } from '@wordpress/element';

export default class FoodIcons extends Component {
    shouldComponentUpdate( nextProps ) {
        return (
            this.props.icon !== nextProps.icon ||
            this.props.size !== nextProps.size ||
            this.props.className !== nextProps.className
        );
    }

    render() {
        const { icon, className, size = 20 } = this.props;
        const iconClass = [ 'foodicon', 'foodicons-' + icon, className ].filter( Boolean ).join( ' ' );

        if ( icon === 'food' ) {
            return (
                <svg
                    role="img"
                    focusable="false"
                    className={ iconClass }
                    xmlns="http://www.w3.org/2000/svg"
                    width={ size }
                    height={ size }
                    viewBox="0 0 380.721 380.722"
                >
                    <path
                        d="M129.194,195.246c0.25-4.072,0.5-8.15,1.034-12.269c0.987-9.766,3.108-19.572,5.275-29.111 c1.319-4.758,2.748-9.458,4.247-14.053c1.917-4.485,3.793-8.946,5.664-13.303c4.235-8.505,8.97-16.452,14.622-23.104 c1.342-1.714,2.672-3.375,3.974-5.042c1.487-1.487,2.975-2.928,4.409-4.369c3.027-2.736,5.652-5.699,8.674-7.872 c6.023-4.461,11.352-8.702,16.777-11.328c5.229-2.917,9.713-5.449,13.756-6.878c7.924-3.189,12.421-4.792,12.421-4.792 s-3.835,3.044-10.538,7.982c-3.463,2.26-7.134,5.827-11.503,9.481c-4.555,3.485-8.679,8.481-13.582,13.269 c-2.452,2.446-4.356,5.519-6.675,8.348c-1.127,1.441-2.283,2.893-3.475,4.369c-0.964,1.627-1.963,3.259-2.974,4.926 c-4.328,6.414-7.563,13.943-10.934,21.582c-1.383,3.997-2.782,8.052-4.212,12.147c-0.976,4.258-2.056,8.562-3.235,12.85 c-1.772,8.812-3.509,17.8-4.259,27.042c-0.522,3.352-0.772,6.733-1.086,10.137c73.436,0.012,130.274,0.058,209.805,0.058 c0.267-3.486,0.418-7.018,0.418-10.567c0-66.981-48.811-122.147-111.621-129.455c4.055-3.793,6.623-9.173,6.623-15.157 c0.023-11.502-9.295-20.809-20.774-20.809c-11.491,0-20.82,9.307-20.82,20.809c0,5.996,2.556,11.363,6.622,15.157 c-62.805,7.308-111.603,62.474-111.603,129.455c0,3.538,0.127,7.023,0.389,10.498 C114.369,195.246,121.857,195.246,129.194,195.246z"
                    />
                    <rect
                        x="83.329"
                        y="202.995"
                        width="297.392"
                        height="26.236"
                    />
                    <path
                        d="M258.631,247.855c-15.115,7.343-67.818,26.351-67.818,26.351l-62.299-3.903c0,0,35.635-9.911,49.449-13.013 c13.838-3.091,7.819-18.694,0.168-18.694c-7.65,0-74.324,2.753-74.324,2.753L59.534,257.29l11.717,74.162 c0,0,9.115-15.604,18.207-15.604c9.126,0,88.174,2.103,98.904,0c10.736-2.127,76.126-46.859,83.957-52.076 C280.115,258.579,273.805,240.501,258.631,247.855z"
                    />
                    <polygon
                        points="0,265.261 0,361.394 67.83,348.694 50.861,256.313        "
                    />
                </svg>
            );
        } else if ( icon === 'food-1' ) {
            return (
                <svg
                    role="img"
                    focusable="false"
                    className={ iconClass }
                    xmlns="http://www.w3.org/2000/svg"
                    width={ size }
                    height={ size }
                    viewBox="0 0 302.459 302.46"
                >
                    <path
                        d="M163.816,222.91c38.745,0,70.269-31.514,70.269-70.259c0-38.745-31.523-70.274-70.269-70.274 c-38.743,0-70.264,31.524-70.264,70.274C93.552,191.396,125.068,222.91,163.816,222.91z"
                    />
                    <path
                        d="M163.816,241.771c49.226,0,89.118-39.903,89.118-89.119c0-49.228-39.893-89.123-89.118-89.123 c-49.221,0-89.119,39.895-89.119,89.123C74.697,201.867,114.595,241.771,163.816,241.771z M163.816,77.183 c41.608,0,75.469,33.862,75.469,75.469c0,41.609-33.86,75.464-75.469,75.464c-41.609,0-75.464-33.854-75.464-75.464 C88.352,111.045,122.207,77.183,163.816,77.183z"
                    />
                    <path
                        d="M302.459,250.062l-5.2-200.026c0-4.307-3.493-7.8-7.8-7.8c-1.152,0-2.234,0.264-3.214,0.718v-0.074 c0,0-0.203,0.13-0.493,0.328c-0.746,0.412-1.416,0.919-1.995,1.539c-5.708,4.685-23.907,23.78-25.431,49.592 c-2.311,39.372,16.813,55.317,23.328,69.921l-5.199,85.798c0,4.306,8.693,7.8,12.999,7.8 C293.766,257.862,302.459,254.369,302.459,250.062z"
                    />
                    <path
                        d="M13.614,128.206l13.461,6.724c1.534,0.769,3.225,1.33,4.992,1.747l-5.2,117.007c0,3.615,8.696,6.54,13,6.54 c4.306,0,13-2.925,13-6.54l-5.2-117.606c1.831-0.576,3.595-1.279,5.139-2.224l9.973-6.073c7.196-4.39,12.619-14.045,12.619-22.475 V52.88c0-4.307-3.494-7.8-7.8-7.8c-4.304,0-7.8,3.493-7.8,7.8v47.225h-4.332V52.88c0-4.307-3.494-7.8-7.8-7.8 c-4.304,0-7.8,3.493-7.8,7.8v47.225h-4.347V52.88c0-4.307-3.494-7.8-7.8-7.8c-4.304,0-7.8,3.493-7.8,7.8v47.225H15.6V54.565 c0-4.306-3.494-7.8-7.8-7.8c-4.304,0-7.8,3.494-7.8,7.8v51.612C0,114.852,5.855,124.327,13.614,128.206z"
                    />
                </svg>
            );
        } else if ( icon === 'cook' ) {
            return (
                <svg
                    role="img"
                    focusable="false"
                    className={ iconClass }
                    xmlns="http://www.w3.org/2000/svg"
                    width={ size }
                    height={ size }
                    viewBox="0 0 35.235 35.235"
                >
                    <path
                        d="M26.776,12.687H19.25c0.68,0,1.233-0.553,1.233-1.234s-0.554-1.23-1.233-1.23h-3.078c-0.68,0-1.232,0.549-1.232,1.23 s0.553,1.234,1.232,1.234H8.645c-2.094,0-3.828,1.877-4.165,3.875h26.464C30.605,14.563,28.871,12.687,26.776,12.687zz"
                    />
                    <path
                        d="M31.005,18.677v-0.352H4.479H4.417H0v1.762h4.417v10.918c0,2.338,1.894,4.229,4.228,4.229h18.132 c2.336,0,4.229-1.891,4.229-4.229V20.439h4.229v-1.762H31.005z"
                    />
                    <path
                        d="M11.24,4.235c0.123,0.162,0.254,0.318,0.391,0.465l0.341,0.342c0.216,0.217,0.417,0.434,0.577,0.629 c0.08,0.098,0.146,0.191,0.195,0.268c0.047,0.076,0.09,0.135,0.1,0.223c0.012,0.094-0.037,0.221-0.133,0.348 c-0.096,0.125-0.23,0.246-0.387,0.367c0.186,0.072,0.389,0.096,0.605,0.07c0.215-0.025,0.451-0.121,0.648-0.326 c0.195-0.205,0.304-0.508,0.321-0.775c0.019-0.27-0.022-0.514-0.083-0.734c-0.123-0.438-0.327-0.793-0.545-1.119 c-0.109-0.16-0.244-0.322-0.34-0.447c-0.096-0.113-0.185-0.229-0.266-0.344c-0.33-0.459-0.561-0.873-0.647-1.359 c-0.09-0.492,0.01-1.121,0.307-1.842c-0.771,0.162-1.457,0.807-1.681,1.709c-0.111,0.445-0.087,0.934,0.032,1.363 C10.793,3.511,11.002,3.897,11.24,4.235z"
                    />
                    <path
                        d="M15.809,4.235C15.932,4.397,16.064,4.553,16.2,4.7l0.34,0.342c0.216,0.217,0.416,0.434,0.58,0.629 c0.077,0.098,0.143,0.191,0.193,0.268c0.049,0.076,0.09,0.135,0.098,0.223c0.013,0.094-0.035,0.221-0.131,0.348 c-0.095,0.125-0.23,0.246-0.389,0.367c0.188,0.072,0.392,0.096,0.607,0.07c0.214-0.025,0.453-0.121,0.648-0.326 c0.197-0.205,0.304-0.508,0.322-0.775c0.019-0.27-0.021-0.514-0.082-0.734c-0.125-0.438-0.33-0.793-0.548-1.119 c-0.107-0.16-0.243-0.322-0.339-0.447c-0.094-0.113-0.185-0.229-0.264-0.344c-0.331-0.459-0.563-0.873-0.649-1.359 c-0.09-0.49,0.008-1.119,0.304-1.84c-0.77,0.162-1.455,0.807-1.678,1.709c-0.111,0.445-0.088,0.934,0.031,1.363 C15.363,3.511,15.568,3.897,15.809,4.235z"
                    />
                    <path
                        d="M19.972,4.235c0.122,0.162,0.253,0.318,0.39,0.465l0.341,0.342c0.216,0.217,0.415,0.434,0.577,0.629 c0.08,0.098,0.146,0.191,0.195,0.268c0.047,0.076,0.088,0.135,0.1,0.223c0.013,0.094-0.037,0.221-0.133,0.348 c-0.095,0.125-0.23,0.246-0.389,0.367c0.188,0.072,0.392,0.096,0.605,0.07c0.215-0.025,0.453-0.121,0.65-0.326 c0.195-0.205,0.303-0.508,0.32-0.775c0.02-0.27-0.021-0.514-0.082-0.734c-0.123-0.438-0.326-0.793-0.545-1.119 c-0.109-0.16-0.244-0.322-0.34-0.447c-0.096-0.113-0.186-0.229-0.266-0.344c-0.33-0.459-0.561-0.873-0.646-1.359 c-0.091-0.492,0.009-1.121,0.304-1.842c-0.77,0.162-1.457,0.807-1.679,1.709c-0.11,0.445-0.087,0.934,0.032,1.363 C19.524,3.511,19.731,3.897,19.972,4.235z"
                    />
                </svg>
            );
        } else if ( icon === 'shop' ) {
            return (
                <svg
                    role="img"
                    focusable="false"
                    className={ iconClass }
                    xmlns="http://www.w3.org/2000/svg"
                    width={ size }
                    height={ size }
                    viewBox="0 0 512 512"
                >
                    <path
                        d="M0,222.8v81.401c0,8.284,6.716,15,15,15h81.4V222.8H0z"
                    />
                    <path
                        d="M415.6,222.8v96.401H497c8.285,0,15-6.716,15-15V222.8H415.6z"
                    />
                    <polygon
                        points="222.801,222.8 222.801,319.201 254.934,319.201 289.201,319.201 289.201,222.8         "
                    />
                    <rect
                        x="126.4"
                        y="222.8"
                        width="66.4"
                        height="96.4"
                    />
                    <polygon
                        points="485.678,126.4 26.322,126.4 4.189,192.8 507.81,192.8         "
                    />
                    <path
                        d="M449.867,349.201V400.6H254.934v-51.398h-222.8V497c0,8.284,6.716,15,15,15h417.733c8.283,0,15-6.716,15-15V349.201 H449.867z M449.868,482h-0.001H254.934v-51.4h194.934V482z"
                    />
                    <path
                        d="M464.867,0H47.134c-8.284,0-15,6.716-15,15v81.4h447.733V15C479.867,6.716,473.15,0,464.867,0z"
                    />
                    <rect
                        x="319.2"
                        y="222.8"
                        width="66.4"
                        height="96.4"
                    />
                </svg>
            );
        } else if ( icon === 'snack' ) {
            return (
                <svg
                    role="img"
                    focusable="false"
                    className={ iconClass }
                    xmlns="http://www.w3.org/2000/svg"
                    width={ size }
                    height={ size }
                    viewBox="0 0 512 512"
                >
                    <path
                        d="M419.079,71.914h-69.164c27.546,0,52.231,12.488,68.689,32.101c13.076,15.582,20.96,35.661,20.96,57.548 c0.001,23.946-9.324,46.459-26.257,63.392c-13.085,13.084-29.505,21.626-47.342,24.832v190.299h53.113 c11.843,0,21.443-9.6,21.443-21.443V255.259C481.458,245.553,512,208.695,512,164.834C512,113.598,470.316,71.914,419.079,71.914z"
                    />
                    <path
                        d="M351.935,104.016H57.546C25.815,104.016,0,129.831,0,161.562c0.002,31.73,25.818,57.546,57.546,57.546 c8.865,0,16.055,7.187,16.055,16.051V439.9h262.283V235.159c0-4.257,1.691-8.34,4.701-11.35c3.01-3.01,7.092-4.701,11.349-4.701 c0,0,0,0,0.001,0c15.371,0.001,29.823-5.984,40.692-16.854c10.869-10.869,16.855-25.32,16.854-40.692 C409.482,129.831,383.666,104.016,351.935,104.016z M171.928,305.383c-2.985,2.996-7.127,4.708-11.343,4.708 c-4.227,0-8.368-1.712-11.353-4.708c-2.985-2.985-4.697-7.116-4.697-11.343c0-4.227,1.712-8.368,4.697-11.353 c2.986-2.985,7.126-4.697,11.353-4.697s8.357,1.712,11.343,4.697c2.996,2.985,4.708,7.126,4.708,11.353 C176.637,298.256,174.924,302.397,171.928,305.383z M279.931,378.982c-2.985,2.985-7.116,4.708-11.343,4.708 s-8.368-1.722-11.353-4.708c-2.985-2.985-4.697-7.127-4.697-11.353c0-4.216,1.712-8.357,4.697-11.343 c2.986-2.985,7.126-4.708,11.353-4.708c4.227,0,8.357,1.722,11.343,4.708c2.996,2.985,4.708,7.127,4.708,11.343 C284.64,371.855,282.928,375.996,279.931,378.982z"
                    />
                </svg>
            );
        } else if ( icon === 'recipes' ) {
            return (
                <svg
                    role="img"
                    focusable="false"
                    className={ iconClass }
                    xmlns="http://www.w3.org/2000/svg"
                    width={ size }
                    height={ size }
                    viewBox="0 0 512 512"
                >
                    <path
                        d="M54.294,0c-8.452,0-15.329,6.877-15.329,15.33v481.34c0,8.452,6.877,15.33,15.33,15.33H89.26V0H54.294z"
                    />
                    <rect
                        x="232.248"
                        y="285.398"
                        width="101.885"
                        height="33.546"
                    />
                    <path
                        d="M400.306,0H119.299v512h281.007c40.104,0,72.73-32.626,72.73-72.73V72.73C473.036,32.626,440.41,0,400.306,0z M364.176,282.782v51.184c0,8.295-6.725,15.02-15.02,15.02H217.228c-8.295,0-15.02-6.725-15.02-15.02v-50.868 c-20.32-6.396-35.099-25.412-35.099-47.817c0-27.637,22.483-50.119,50.119-50.119c4.581,0,9.084,0.629,13.409,1.826 c8.788-21.52,29.934-36.728,54.576-36.728c28.203,0,51.985,19.881,57.649,46.669c2.071-0.294,4.174-0.445,6.295-0.445 c24.513,0,44.457,19.943,44.457,44.457C393.613,260.186,381.32,276.608,364.176,282.782z"
                    />
                    <path
                        d="M349.156,226.524c-3.652,0-7.135,1.367-9.808,3.85l-0.023-0.01c-2.68,2.513-6.273,4.063-10.237,4.063 c-8.274,0-14.982-6.708-14.982-14.982c0-0.025,0.004-0.05,0.004-0.075l-0.004-0.002c0-1.502-0.023-10.393-0.054-11.973 c-0.926-15.208-13.563-27.096-28.841-27.096c-15.898,0-28.835,12.906-28.891,28.791c0.003,0.134,0.02,0.264,0.02,0.4 c0,8.399-6.809,15.208-15.208,15.208c-4.431,0-8.406-1.906-11.186-4.93c-3.584-2.943-8.048-4.567-12.72-4.567 c-11.072,0-20.08,9.007-20.08,20.08c0,11.073,9.008,20.08,20.08,20.08h131.929c7.95,0,14.417-6.469,14.417-14.418 S357.106,226.524,349.156,226.524z"
                    />
                </svg>
            );
        } else if ( icon === 'shopping-basket' ) {
            return (
                <svg
                    role="img"
                    focusable="false"
                    className={ iconClass }
                    xmlns="http://www.w3.org/2000/svg"
                    width={ size }
                    height={ size }
                    viewBox="0 0 15.935 15.935"
                >
                    <path d="M13.451,7.573L13.451,7.573c0.321-0.553,0.335-1.227,0.046-1.795l0.019-0.032
                        c0.328,0.071,0.679-0.083,0.848-0.373c0.105-0.181,0.134-0.393,0.081-0.596c-0.055-0.203-0.184-0.373-0.365-0.479l-1.342-0.781
                        c-0.362-0.21-0.865-0.077-1.075,0.284c-0.175,0.3-0.127,0.669,0.096,0.919l-0.02,0.033c-0.637,0.03-1.22,0.378-1.538,0.925
                        L9.674,6.585V5.93c0-1.068-0.869-1.937-1.938-1.937H5.911c-1.068,0-1.937,0.869-1.937,1.937v1.643H1.548v1.966h1.101l1.166,4.594
                        c0,0.993,1.412,1.802,2.479,1.802h4.087c1.067,0,2.171-0.825,2.171-1.818L13.85,9.54h1.101V7.574L13.451,7.573L13.451,7.573z
                         M4.479,5.931c0-0.789,0.643-1.432,1.432-1.432h1.825c0.79,0,1.432,0.643,1.432,1.432v1.533C9.161,7.477,9.154,7.489,9.147,7.503
                        H4.479V5.931z M10.638,5.934c0.246-0.423,0.69-0.677,1.188-0.677l0.199,0.006l0.276-0.472l0.117-0.225L12.2,4.439
                        c-0.135-0.078-0.18-0.25-0.103-0.384c0.076-0.128,0.254-0.177,0.385-0.101l1.342,0.782c0.064,0.037,0.11,0.098,0.13,0.17
                        s0.009,0.148-0.028,0.213c-0.075,0.129-0.236,0.188-0.394,0.096l-0.219-0.128l-0.402,0.691l0.079,0.129
                        c0.268,0.435,0.276,0.976,0.023,1.41l-0.148,0.256H9.681L10.638,5.934z M6.935,13.99c0,0.278-0.244,0.505-0.543,0.505
                        S5.85,14.268,5.85,13.99v-2.976c0-0.279,0.243-0.506,0.542-0.506c0.3,0,0.543,0.227,0.543,0.506V13.99z M8.799,13.99
                        c0,0.278-0.243,0.505-0.543,0.505c-0.3,0-0.543-0.227-0.543-0.505v-2.976c0-0.279,0.243-0.506,0.543-0.506
                        c0.3,0,0.543,0.227,0.543,0.506V13.99z M10.614,13.99c0,0.278-0.243,0.505-0.542,0.505c-0.3,0-0.544-0.227-0.544-0.505v-2.976
                        c0-0.279,0.244-0.506,0.544-0.506c0.299,0,0.542,0.227,0.542,0.506V13.99z" />
                    <path d="M3.749,6.261V5.959c0-1.033,0.719-1.898,1.682-2.128c-1.739-2.51-3.623-4.189-4.246-3.766
                        C0.551,0.498,1.469,2.95,3.237,5.543C3.406,5.792,3.577,6.03,3.749,6.261z M4.681,3.823C4.543,4.077,4.347,4.247,4.138,4.397
                        c-0.215,0.141-0.445,0.26-0.732,0.296c0.137-0.256,0.332-0.426,0.542-0.575C4.164,3.978,4.394,3.858,4.681,3.823z M2.441,3.278
                        c0.137-0.256,0.333-0.426,0.543-0.575c0.216-0.14,0.445-0.26,0.733-0.295C3.579,2.663,3.383,2.832,3.174,2.982
                        C2.958,3.123,2.729,3.242,2.441,3.278z" />
                </svg>
            );
        } else if ( icon === 'chef-cooking' ) {
            return (
                <svg
                    role="img"
                    focusable="false"
                    className={ iconClass }
                    xmlns="http://www.w3.org/2000/svg"
                    width={ size }
                    height={ size }
                    viewBox="0 0 58.709 58.709"
                >
                    <path d="M24.516,8.964v5.81h0.085h9.306h0.098V8.797c0.938-0.3,1.742-0.996,2.117-1.991
                        c0.653-1.727-0.219-3.658-1.945-4.311c-0.489-0.185-0.992-0.235-1.479-0.192c-0.381-0.916-1.114-1.683-2.118-2.062
                        C28.827-0.421,26.9,0.33,26.014,1.92c-1.543-0.08-3.031,0.817-3.604,2.341C21.695,6.145,22.641,8.243,24.516,8.964z" />
                    <polygon points="34.993,52.724 10.459,52.724 10.459,58.709 48.249,58.709 48.249,52.724      " />
                    <path d="M27.659,21.266l2.104,2.301l2.179-2.117C30.877,21.322,29.363,21.203,27.659,21.266z" />
                    <path d="M24.948,39.585l-2.447,4.24H20.61h-1.036h-2.885v0.971h-1.053c-0.356,0-0.646,0.291-0.646,0.646
                        c0,0.357,0.29,0.646,0.646,0.646h1.053v5.5h15.044v-5.5h1.051c0.357,0,0.648-0.289,0.648-0.646c0-0.355-0.291-0.646-0.648-0.646
                        h-1.051v-0.971h-8.407l2.313-4.011c0.108,0.036,0.223,0.074,0.328,0.108c3.833,1.255,5.462-4.77,1.658-6.017
                        c-2.532-0.827-6.397-2.001-8.024-4.244c0.027-0.023,0.055-0.047,0.09-0.07c0.348-0.238,0.727-0.435,1.119-0.61V29.5
                        c0.386,0.306,0.743,0.563,1.048,0.731c1.631,1.271,4.245,2.122,6.095,2.724l0.391,0.127c2.42,0.793,3.203,3.01,2.91,4.854
                        c-0.34,2.127-1.951,3.612-3.919,3.612c-0.449,0-0.913-0.076-1.377-0.229c-0.073-0.023-0.157-0.052-0.229-0.076l-1.022,1.672h7.836
                        v0.971h0.271c0.786,0,1.427,0.641,1.427,1.427s-0.641,1.426-1.427,1.426h-0.271v5.075h4.379V29.362
                        c0.053,0.043,0.109,0.081,0.162,0.127c2.258,1.964,2.041,5.382,1.699,8.062c-0.508,3.98,5.734,3.934,6.236,0
                        c0.577-4.514-0.175-9.168-3.525-12.471c-2.095-2.062-4.902-3.027-7.793-3.358l-2.979,2.896l2.565,2.805l-1.05,0.96l-6.38-6.979
                        c-0.795,0.093-1.604,0.227-2.411,0.428c-4.496,0.897-11.324,3.11-10.124,8.881C14.342,35.612,20.531,38.095,24.948,39.585z" />
                    <path d="M33.92,15.451h-9.333c0,2.578,2.091,4.667,4.667,4.667C31.833,20.118,33.92,18.029,33.92,15.451z"
                        />
                    <path d="M20.999,39.515l-0.013,3.4h1.095l1.452-2.42C22.732,40.209,21.852,39.886,20.999,39.515z" />
                    <path d="M15.471,38.152c-0.07,0.323-0.02,0.669,0.085,0.979c0.117,0.308,0.301,0.572,0.501,0.805
                        c0.217,0.229,0.426,0.396,0.582,0.57c0.175,0.173,0.311,0.365,0.405,0.552c0.084,0.188,0.114,0.379,0.021,0.591
                        c-0.084,0.216-0.273,0.417-0.493,0.598c0.288-0.024,0.574-0.144,0.809-0.38c0.236-0.235,0.332-0.646,0.247-0.981
                        c-0.141-0.67-0.675-1.125-0.991-1.469c-0.332-0.355-0.548-0.754-0.562-1.201c-0.011-0.449,0.19-0.95,0.497-1.426
                        C16.054,37.021,15.602,37.501,15.471,38.152z" />
                    <path d="M18.37,39.998c-0.048,0.217-0.013,0.45,0.057,0.659c0.08,0.208,0.204,0.388,0.339,0.544
                        c0.147,0.157,0.288,0.271,0.394,0.387c0.119,0.117,0.21,0.248,0.274,0.375c0.057,0.127,0.076,0.256,0.014,0.397
                        c-0.056,0.146-0.184,0.283-0.333,0.405c0.194-0.018,0.388-0.098,0.547-0.258c0.158-0.159,0.224-0.438,0.167-0.664
                        c-0.095-0.453-0.457-0.762-0.67-0.994c-0.226-0.24-0.372-0.51-0.38-0.812c-0.008-0.306,0.127-0.646,0.337-0.968
                        C18.764,39.23,18.458,39.554,18.37,39.998z" />
                </svg>
            );
        } else if ( icon === 'chef-cooking-1' ) {
            return (
                <svg
                    role="img"
                    focusable="false"
                    className={ iconClass }
                    xmlns="http://www.w3.org/2000/svg"
                    width={ size }
                    height={ size }
                    viewBox="0 0 53.608 53.608"
                >
                    <path d="M44.067,31.714c-0.001-0.059,0.002-0.118-0.002-0.178l-0.704-11.25
                        c-0.122-1.958-1.804-3.447-3.767-3.323c-1.126,0.07-2.095,0.659-2.692,1.518c-4.167,0.882-6.034,0.907-10.305-0.109
                        c-1.226-0.291-2.458,0.465-2.75,1.693c-0.292,1.227,0.465,2.458,1.692,2.75c2.596,0.617,4.535,0.894,6.394,0.894
                        c0.386,0,0.768-0.016,1.151-0.039c-0.955,2.306-1.601,5.78-1.595,10.968c0,5.885,0,5.885,0,5.885l3.777-0.083
                        c-0.555,3.431-0.39,7.038,0.254,10.721c0.25,1.436,0.481,2.447,1.891,2.447c0.168,0,0.34-0.015,0.512-0.045
                        c1.606-0.28,2.682-1.811,2.4-3.417c-0.988-5.657,0.185-10.857,3.483-15.457C44.453,33.786,44.507,32.652,44.067,31.714z" />
                    <path d="M9.254,35.752h17.107v16.717H9.254V35.752z" />
                    <path d="M38.982,16.296c1.84-0.163,3.129-1.778,2.881-3.609l-6.662,0.59
                        C35.449,15.107,37.143,16.458,38.982,16.296z" />
                    <path d="M34.272,5.365l0.949,6.981l6.358-0.563l-0.961-7.068c0.61-0.545,0.944-1.374,0.823-2.267
                        c-0.201-1.477-1.569-2.568-3.053-2.437c-0.633,0.056-1.183,0.325-1.592,0.729c-0.508-0.322-1.117-0.488-1.748-0.432
                        c-1.488,0.13-2.529,1.435-2.327,2.914C32.851,4.169,33.459,4.955,34.272,5.365z" />
                    <path d="M12.226,33.813h11.165v-7.777l1.14-0.415V24.7l-1.14,0.416V24.34H12.226v0.776L11.085,24.7v0.921
                        l1.141,0.415C12.226,26.036,12.226,33.813,12.226,33.813z M13.24,25.355h9.135v7.443H13.24V25.355z" />
                    <path d="M19.67,18.334c0.35,0,0.634-0.284,0.634-0.634s-0.285-0.634-0.634-0.634
                        c-0.35,0-0.634,0.284-0.634,0.634S19.32,18.334,19.67,18.334z M19.67,17.573c0.07,0,0.126,0.058,0.126,0.127
                        c0,0.14-0.253,0.14-0.253,0C19.544,17.631,19.601,17.573,19.67,17.573z" />
                    <path d="M21.89,20.872c0.595,0,1.079-0.483,1.079-1.078s-0.484-1.079-1.079-1.079
                        c-0.594,0-1.078,0.483-1.078,1.079C20.813,20.388,21.296,20.872,21.89,20.872z M21.89,19.222c0.315,0,0.571,0.256,0.571,0.571
                        s-0.256,0.571-0.571,0.571c-0.314,0-0.57-0.256-0.57-0.571S21.576,19.222,21.89,19.222z" />
                    <circle cx="18.696" cy="21.676" r="0.888" />
                </svg>
            );
        } else if ( icon === 'chef' ) {
            return (
                <svg
                    role="img"
                    focusable="false"
                    className={ iconClass }
                    xmlns="http://www.w3.org/2000/svg"
                    width={ size }
                    height={ size }
                    viewBox="0 0 469.333 469.333"
                >
                    <path d="M394.667,384H74.75c-5.885,0-10.656,4.771-10.667,10.656l-0.042,31.104c-0.01,11.635,4.51,22.573,12.729,30.802
                        c8.229,8.24,19.156,12.771,30.792,12.771h254.25c24,0,43.521-19.521,43.521-43.521v-31.146
                        C405.333,388.771,400.563,384,394.667,384z" />
                    <path d="M352,42.667c-6.531,0-13.24,0.656-20.344,1.979C307.25,16.187,272.271,0,234.667,0c-70.583,0-128,57.417-128,128
                        c0,5.885-4.781,10.667-10.667,10.667c-5.885,0-10.667-4.781-10.667-10.667c0-23.094,5.313-45.438,15.792-66.406
                        c1.865-3.729,1.385-8.198-1.219-11.448c-2.604-3.229-6.865-4.667-10.906-3.677C36.594,59.542,0,106.229,0,160
                        c0,44.333,25,84.635,64.25,104.562l-0.115,87.427c0,2.823,1.115,5.542,3.115,7.552c2.01,2,4.719,3.125,7.552,3.125h319.865
                        c5.896,0,10.667-4.771,10.667-10.667v-87.594c39.104-19.979,64-60.219,64-104.406C469.333,95.302,416.698,42.667,352,42.667z
                         M156.104,296.25c-1.99,1.625-4.385,2.417-6.76,2.417c-3.083,0-6.146-1.333-8.26-3.896c-3.521-4.302-34.417-42.76-34.417-70.771
                        c0-5.896,4.771-10.667,10.667-10.667c5.896,0,10.667,4.771,10.667,10.667c0,15.438,18.146,43.292,29.583,57.229
                        C161.312,285.792,160.656,292.51,156.104,296.25z M245.333,288c0,5.896-4.771,10.667-10.667,10.667S224,293.896,224,288v-64
                        c0-5.896,4.771-10.667,10.667-10.667s10.667,4.771,10.667,10.667V288z M328.25,294.771c-2.115,2.563-5.167,3.896-8.25,3.896
                        c-2.385,0-4.781-0.792-6.76-2.417c-4.552-3.74-5.219-10.458-1.49-15.01c11.438-13.969,29.583-41.854,29.583-57.24
                        c0-5.896,4.771-10.667,10.667-10.667c5.896,0,10.667,4.771,10.667,10.667C362.667,252.01,331.771,290.469,328.25,294.771z" />
                </svg>
            );
        } else if ( icon === 'female-cooking' ) {
            return (
                <svg
                    role="img"
                    focusable="false"
                    className={ iconClass }
                    xmlns="http://www.w3.org/2000/svg"
                    width={ size }
                    height={ size }
                    viewBox="0 0 979.7 979.7"
                >
                    <path d="M218.651,636.7c5.5,3.7,11.8,5.399,18,5.399c10.5,0,20.8-5.1,27.1-14.5l75-112.699V539l-77.1,219
                        c-3.2,9.1,3.5,18.6,13.2,18.6h63.9V935.9c0,24.199,19.6,43.8,43.8,43.8s43.8-19.601,43.8-43.8V776.6h21.2V935.9
                        c0,24.199,19.601,43.8,43.8,43.8c24.2,0,43.801-19.601,43.801-43.8V776.6h63.899c9.601,0,16.4-9.5,13.2-18.6l-77.1-219v-24.1
                        l36.5,46.1c6.199,7.8,15.6,12.4,25.6,12.4h82v-65.2h-66.2c0,0-69.8-98-91.399-131.8c-18.2-28.4-48.7-48.4-84.7-48.4
                        c-19.601,0-39.9,6-56.101,17.3c-12.699,8.8-20.699,21-29.3,33.5c-14.899,21.8-29.5,43.8-44.2,65.7
                        c-17.5,26.2-34.899,52.4-52.3,78.6c-12.8,19.2-25.6,38.5-38.3,57.801c-2.4,3.6-4.7,7.1-7.1,10.699
                        C199.651,606.6,203.651,626.7,218.651,636.7z" />
                    <path d="M336.551,143.7c3,2.4,6.2,4.6,9.601,6.6v46.8h181.6v-38.3c3.5-2.5,6.7-5.4,9.6-8.6c3.801-4.1,7-8.7,9.601-13.7
                        c4.7-9,7.399-19.2,7.399-30c0-35.7-29-64.7-64.699-64.7c-10.301,0-20.101,2.4-28.801,6.7C448.452,20,419.952,0,386.751,0
                        c-44.5,0-80.6,36.1-80.6,80.6c0,20.8,7.899,39.8,20.899,54.1C329.952,138,333.152,141,336.551,143.7z" />
                    <path d="M699.251,416.7v75.1V557v54.5c0,9.7,7.8,17.5,17.5,17.5s17.5-7.8,17.5-17.5V416.7c23.9-8.601,41.3-34.5,41.3-65.1
                        c0-37.7-26.3-95.2-58.8-95.2s-58.8,57.5-58.8,95.2C657.851,382.2,675.251,408.1,699.251,416.7z" />
                    <path d="M525.952,248.3c0-7.7,0.399-19.1-0.101-32h-88.899h-88.9c-0.5,12.9-0.1,24.3-0.1,32c0,33.5-29.8,44.7-29.8,44.7
                        c10.199,51.2,82,14.9,82,14.9c-11.7-6.8-17.601-20.3-20.5-33.9c12.199,20.2,33.3,33.5,57.3,33.5s45.1-13.3,57.3-33.5
                        c-2.9,13.7-8.8,27.1-20.5,33.9c0,0,71.7,36.3,82-14.9C555.751,293,525.952,281.8,525.952,248.3z" />
                </svg>
            );
        } else if ( icon === 'room-service' ) {
            return (
                <svg
                    role="img"
                    focusable="false"
                    className={ iconClass }
                    xmlns="http://www.w3.org/2000/svg"
                    width={ size }
                    height={ size }
                    viewBox="0 0 259.816 259.816"
                >
                    <path d="M39.789,29.169c2.194-1.792,2.544-5.015,0.784-7.227c-1.769-2.24-5.031-2.595-7.25-0.821
                        c-5.414,4.306-12.555,16.354-0.831,31.106c8.788,11.066-4.889,27.228-5.021,27.375c-1.869,2.156-1.636,5.416,0.516,7.283
                        c0.98,0.838,2.188,1.263,3.388,1.263c1.438,0,2.877-0.602,3.895-1.778c0.803-0.926,19.413-22.796,5.3-40.559
                        C32.751,35.956,38.534,30.224,39.789,29.169z" />
                    <path d="M73.147,86.885c0.971,0.838,2.179,1.263,3.379,1.263c1.449,0,2.882-0.602,3.895-1.778
                        c0.81-0.926,19.422-22.796,5.302-40.559c-7.824-9.854-2.042-15.581-0.779-16.641c2.193-1.792,2.541-5.015,0.779-7.227
                        c-1.773-2.24-5.029-2.595-7.255-0.821c-5.412,4.306-12.545,16.354-0.829,31.106c8.791,11.066-4.879,27.228-5.021,27.375
                        C70.762,81.758,70.998,85.014,73.147,86.885z" />
                    <path d="M173.167,86.885c0.98,0.838,2.185,1.263,3.37,1.263c1.447,0,2.88-0.602,3.906-1.778
                        c0.793-0.926,19.401-22.796,5.297-40.559c-7.831-9.854-2.053-15.581-0.793-16.641c2.193-1.792,2.548-5.015,0.784-7.227
                        c-1.765-2.24-5.022-2.595-7.253-0.821c-5.404,4.306-12.536,16.354-0.821,31.106c8.783,11.066-4.892,27.228-5.013,27.375
                        C170.777,81.758,171.012,85.014,173.167,86.885z" />
                    <path d="M230.105,29.169c2.193-1.792,2.549-5.015,0.784-7.227c-1.773-2.24-5.026-2.595-7.253-0.821
                        c-5.413,4.306-12.54,16.354-0.821,31.106c8.784,11.066-4.891,27.228-5.021,27.375c-1.876,2.156-1.634,5.416,0.514,7.283
                        c0.979,0.838,2.18,1.263,3.379,1.263c1.438,0,2.875-0.602,3.901-1.778c0.794-0.926,19.406-22.796,5.302-40.559
                        C223.068,35.956,228.846,30.224,230.105,29.169z" />
                    <path d="M121.722,164.17l-1.519,2.254v0.032h2.247v-2.249c0-0.467,0.028-0.934,0.051-1.429h-0.051
                        C122.196,163.297,121.981,163.712,121.722,164.17z" />
                    <path d="M129.903,131.416c-18.967,0-34.394,15.43-34.394,34.396c0,18.977,15.432,34.4,34.394,34.4
                        c18.977,0,34.406-15.429,34.406-34.4C164.31,146.846,148.871,131.416,129.903,131.416z M139.471,144.601l3.496-6.072
                        c0.527-0.905,1.694-1.228,2.609-0.7c0.905,0.527,1.227,1.694,0.699,2.614l-3.5,6.062c-0.35,0.616-0.994,0.956-1.652,0.956
                        c-0.322,0-0.653-0.084-0.952-0.252C139.256,146.678,138.939,145.511,139.471,144.601z M141.968,167.138
                        c-1.209-0.406-1.703-1.068-1.703-1.802c0-1.097,0.9-1.923,2.329-1.923c0.686,0,1.283,0.159,1.651,0.359l-0.321,1.097
                        c-0.252-0.153-0.757-0.354-1.303-0.354c-0.555,0-0.863,0.28-0.863,0.663c0,0.392,0.289,0.564,1.083,0.858
                        c1.125,0.392,1.634,0.966,1.643,1.881c0,1.13-0.877,1.941-2.506,1.941c-0.742,0-1.414-0.182-1.881-0.434l0.317-1.139
                        c0.345,0.219,1.018,0.452,1.577,0.452c0.682,0,0.985-0.284,0.985-0.695C142.98,167.609,142.72,167.408,141.968,167.138z
                         M127.992,135.546c0-1.055,0.861-1.903,1.907-1.903c1.062,0,1.909,0.854,1.909,1.903v7.006c0,1.055-0.852,1.904-1.909,1.904
                        c-1.05,0-1.907-0.854-1.907-1.904V135.546z M114.234,137.843c0.908-0.537,2.084-0.22,2.609,0.695l3.498,6.067
                        c0.527,0.91,0.217,2.076-0.707,2.608c-0.296,0.173-0.625,0.257-0.945,0.257c-0.665,0-1.304-0.336-1.659-0.957l-3.498-6.062
                        C113.016,139.532,113.326,138.36,114.234,137.843z M114.588,162.605c-0.737,0-1.344,0.369-1.759,0.691l-0.46-1.111
                        c0.598-0.48,1.491-0.849,2.534-0.849c1.82,0,2.709,1.152,2.709,2.496c0,1.447-1.043,2.614-2.49,3.939l-0.707,0.62v0.023h3.37
                        v1.303h-5.577v-0.952l0.973-0.905c1.937-1.797,2.854-2.782,2.868-3.879C116.054,163.25,115.662,162.605,114.588,162.605z
                         M102.774,149.305c0.516-0.91,1.687-1.232,2.604-0.695l6.056,3.505c0.913,0.527,1.228,1.699,0.698,2.609
                        c-0.359,0.611-0.994,0.947-1.659,0.947c-0.32,0-0.653-0.079-0.95-0.257l-6.06-3.5C102.555,151.387,102.244,150.22,102.774,149.305
                        z M98.564,164.973c0.005-1.056,0.945-2.026,1.916-1.904l6.996,0.014c1.052,0,1.902,0.854,1.897,1.909
                        c0,1.055-0.854,1.903-1.906,1.903l-6.996-0.009C99.418,166.886,98.564,166.022,98.564,164.973z M111.434,177.857l-6.065,3.482
                        c-0.296,0.173-0.63,0.257-0.952,0.257c-0.663,0-1.304-0.341-1.662-0.957c-0.522-0.915-0.205-2.086,0.708-2.604l6.06-3.486
                        c0.912-0.522,2.079-0.21,2.604,0.7C112.661,176.159,112.346,177.33,111.434,177.857z M120.346,185.372l-3.508,6.049
                        c-0.352,0.611-0.999,0.952-1.652,0.952c-0.327,0-0.661-0.089-0.957-0.262c-0.913-0.527-1.223-1.699-0.693-2.613l3.507-6.049
                        c0.516-0.915,1.692-1.228,2.604-0.695C120.562,183.29,120.873,184.457,120.346,185.372z M124.987,167.623h-1.071v2.101h-1.473
                        v-2.101h-3.736v-1.008l3.375-5.134h1.834v4.97h1.071V167.623z M131.812,194.417c0,1.06-0.852,1.913-1.909,1.913
                        c-1.05,0-1.906-0.858-1.906-1.913v-6.996c0-1.055,0.861-1.909,1.906-1.909c1.062,0,1.909,0.859,1.909,1.909V194.417z
                         M134.318,169.724h-1.561v-3.478c0-0.887-0.329-1.572-1.195-1.572c-0.606,0-1.036,0.41-1.218,0.877
                        c-0.054,0.141-0.068,0.304-0.068,0.472v3.701h-1.556v-8.999h1.556v3.659h0.028c0.187-0.284,0.46-0.527,0.775-0.69
                        c0.315-0.182,0.684-0.28,1.081-0.28c1.053,0,2.158,0.691,2.158,2.675V169.724z M137.566,166.046
                        c-0.027,0.135-0.037,0.303-0.037,0.467v3.211h-1.559v-4.187c0-0.836-0.01-1.442-0.047-1.988h1.335l0.065,1.162h0.037
                        c0.309-0.863,1.031-1.298,1.704-1.298c0.149,0,0.247,0.01,0.368,0.033v1.465c-0.14-0.027-0.28-0.042-0.476-0.042
                        C138.229,164.865,137.717,165.336,137.566,166.046z M145.58,192.121c-0.294,0.177-0.63,0.261-0.952,0.261
                        c-0.662,0-1.302-0.341-1.656-0.952l-3.501-6.062c-0.522-0.915-0.215-2.081,0.7-2.608c0.905-0.532,2.077-0.22,2.609,0.7
                        l3.505,6.062C146.803,190.431,146.49,191.598,145.58,192.121z M157.047,180.653c-0.345,0.611-0.989,0.952-1.656,0.952
                        c-0.312,0-0.648-0.089-0.947-0.257l-6.062-3.491c-0.91-0.527-1.228-1.703-0.705-2.608c0.527-0.91,1.703-1.223,2.613-0.7
                        l6.062,3.491C157.262,178.567,157.584,179.738,157.047,180.653z M161.248,164.973c0.009,1.059-0.85,1.913-1.904,1.913
                        l-7.001,0.009h-0.005c-1.05,0-1.899-0.858-1.908-1.903c0-1.06,0.858-1.909,1.908-1.909l7.006-0.01
                        C160.398,163.068,161.248,163.922,161.248,164.973z M157.047,149.3c0.532,0.91,0.215,2.087-0.69,2.609l-6.067,3.505
                        c-0.299,0.178-0.635,0.257-0.952,0.257c-0.662,0-1.307-0.336-1.651-0.947c-0.532-0.91-0.215-2.082,0.695-2.609l6.062-3.505
                        C155.357,148.068,156.52,148.39,157.047,149.3z" />
                    <path d="M259.816,229.509v-10.319c0-5.693-4.62-10.314-10.333-10.314h-13.796c0-56.695-44.607-102.962-100.627-105.65V92.971
                        c5.278-2.07,9.04-7.173,9.04-13.196c0-7.829-6.347-14.186-14.192-14.186c-7.831,0-14.197,6.356-14.197,14.186
                        c0,6.023,3.762,11.126,9.038,13.196v10.254c-56.031,2.688-100.62,48.955-100.62,105.646H10.321C4.621,208.871,0,213.491,0,219.185
                        v10.319c0,5.708,4.621,10.318,10.321,10.318h239.162C255.196,239.827,259.816,235.217,259.816,229.509z M129.903,204.031
                        c-21.069,0-38.211-17.147-38.211-38.219c0-21.067,17.142-38.219,38.211-38.219c21.077,0,38.224,17.151,38.224,38.219
                        C168.127,186.889,150.98,204.031,129.903,204.031z" />
                </svg>
            );
        } else if ( icon === 'clock' ) {
            return (
                <svg
                    role="img"
                    focusable="false"
                    className={ iconClass }
                    xmlns="http://www.w3.org/2000/svg"
                    width={ size }
                    height={ size }
                    viewBox="0 0 45.773 45.773"
                >
                    <path d="M5.081,13.737c2.582-3.942,6.609-6.849,11.32-7.988c0.363-0.087,0.662-0.344,0.802-0.689
                        c0.141-0.346,0.107-0.738-0.091-1.055C15.604,1.601,12.936,0,9.888,0C5.176,0,1.354,3.82,1.354,8.532c0,2,0.691,3.837,1.845,5.29
                        c0.231,0.293,0.589,0.455,0.962,0.438S4.877,14.048,5.081,13.737z" />
                    <path d="M35.886,0c-3.034,0-5.693,1.586-7.204,3.974c-0.2,0.316-0.235,0.711-0.094,1.059c0.142,0.349,0.442,0.605,0.809,0.691
                        c4.724,1.112,8.765,3.999,11.369,7.928c0.207,0.312,0.552,0.505,0.927,0.518c0.375,0.014,0.731-0.154,0.961-0.451
                        c1.105-1.436,1.766-3.232,1.766-5.186C44.417,3.82,40.598,0,35.886,0z" />
                    <path d="M41.752,26.132c0-3.294-0.857-6.39-2.351-9.084c-2.769-4.99-7.742-8.577-13.595-9.475c-0.933-0.143-1.88-0.24-2.853-0.24
                        c-1.016,0-2.006,0.104-2.979,0.26C14.146,8.528,9.198,12.13,6.458,17.126c-1.467,2.676-2.304,5.744-2.304,9.006
                        c0,5.586,2.463,10.597,6.343,14.041l-1.584,2.231c-0.682,0.961-0.456,2.291,0.505,2.975c0.375,0.266,0.806,0.395,1.233,0.395
                        c0.668,0,1.326-0.313,1.741-0.898l1.583-2.23c2.669,1.457,5.728,2.287,8.978,2.287c3.249,0,6.308-0.83,8.977-2.287l1.583,2.23
                        c0.416,0.586,1.073,0.898,1.741,0.898c0.427,0,0.857-0.129,1.232-0.395c0.961-0.684,1.188-2.014,0.506-2.975l-1.584-2.231
                        C39.288,36.729,41.752,31.718,41.752,26.132z M22.954,39.674c-7.468,0-13.542-6.074-13.542-13.542
                        c0-2.328,0.591-4.519,1.629-6.435c1.976-3.644,5.58-6.269,9.826-6.93c0.682-0.106,1.375-0.178,2.087-0.178
                        c0.67,0,1.325,0.065,1.97,0.16c4.282,0.628,7.925,3.253,9.924,6.913c1.05,1.923,1.647,4.126,1.647,6.469
                        C36.495,33.6,30.421,39.674,22.954,39.674z" />
                    <path d="M30.54,29.3l-5.166-3.19c-0.107-0.604-0.434-1.125-0.893-1.494l0.236-6.482c0.029-0.828-0.617-1.523-1.444-1.554
                        c-0.825-0.038-1.523,0.616-1.554,1.444l-0.237,6.489c-0.641,0.452-1.063,1.196-1.063,2.041c0,1.381,1.119,2.499,2.5,2.499
                        c0.393,0,0.76-0.099,1.09-0.26l4.955,3.062c0.246,0.15,0.519,0.223,0.787,0.223c0.503,0,0.993-0.252,1.278-0.711
                        C31.465,30.66,31.245,29.736,30.54,29.3z" />
                </svg>
            );
        }

        return null;
    }
}
