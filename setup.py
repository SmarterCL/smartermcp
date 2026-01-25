from setuptools import setup, find_packages

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

with open("requirements.txt", "r", encoding="utf-8") as fh:
    requirements = [line.strip() for line in fh if line.strip() and not line.startswith("#")]

setup(
    name="smartermcp",
    version="1.0.0",
    author="SmarterCL",
    author_email="tech@smarterbot.cl",
    description="SmarterMCP OAuth platform with JWT authorization codes",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/SmarterCL/smartermcp",
    packages=find_packages(where="src"),
    package_dir={"": "src"},
    classifiers=[
        "Development Status :: 5 - Production/Stable",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.11",
        "Framework :: FastAPI",
    ],
    python_requires=">=3.11",
    install_requires=requirements,
    extras_require={
        "dev": [
            "pytest>=8.0",
            "pytest-asyncio>=0.23",
            "black>=24.0",
            "flake8>=7.0",
        ],
        "prod": [
            "gunicorn>=22.0",
            "uvloop>=0.19",
        ],
    },
    entry_points={
        "console_scripts": [
            "run-mcp-server=src.oauth.consent:main",
        ],
    },
)