from setuptools import setup, find_packages

setup(
    name='gastroflow',
    version='0.1.0',
    packages=find_packages(where='src'),
    package_dir={'': 'src'},
    python_requires='>=3.9',
    install_requires=[
        line.strip() for line in open('requirements.txt')
        if line.strip() and not line.startswith('#')
    ],
    include_package_data=True,
    package_data={'': ['*.md', '*.yaml']}
)