from setuptools import setup, find_packages

setup(
    name='gastroapp',
    version='0.1',
    packages=find_packages(where='src'),
    package_dir={'': 'src'},
    install_requires=[
        'flask>=2.0',
        'flask-jwt-extended>=4.0',
        'redis>=4.5.0',
        'pydantic>=2.0',
        'requests>=2.31.0'
    ],
)