import OrbitSpinner from '@/components/loading/LoadingComponent';


const loading = () => {
    return (
        <div className='max-w-7xl mx-auto flex items-center justify-center'>
            <OrbitSpinner/>
        </div>
    );
};

export default loading;