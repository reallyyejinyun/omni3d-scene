import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { useStore } from '@/store';

/**
 * 场景捕获组件：将 Three.js 场景对象同步到全局 Store
 */
const SceneCapture: React.FC = () => {
    const state = useThree();
    const { scene, camera, controls, gl } = state as any;
    const setState = useStore(state => state.setState);

    useEffect(() => {
        setState({ scene, camera, controls, gl });
        (window).__viewportThreeState = state;
    }, [scene, camera, controls, gl, setState, state]);

    return null;
};

export default SceneCapture;
